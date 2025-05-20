import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveDto, UpdateLeaveDto, UpdateLeaveStatusDto } from './dto';

@Injectable()
export class LeaveService {
    constructor(private readonly prisma: PrismaService) { }

    private async validateLeaveDates(startDate: Date, endDate: Date): Promise<void> {
        if (startDate > endDate) {
            throw new BadRequestException('Start date must be before or equal to end date');
        }

        // Check for overlapping leaves
        const overlappingLeaves = await this.prisma.leave.findMany({
            where: {
                start_date: {
                    lte: endDate,
                },
                end_date: {
                    gte: startDate,
                },
                delete_time: null,
            },
        });

        if (overlappingLeaves.length > 0) {
            throw new BadRequestException('Leave dates overlap with existing leave');
        }
    }

    private async validateLeaveTypeExists(leaveTypeId: string): Promise<void> {
        const leaveType = await this.prisma.leaveType.findUnique({
            where: { id: leaveTypeId },
        });

        if (!leaveType || leaveType.delete_time) {
            throw new NotFoundException(`Leave type with id ${leaveTypeId} not found`);
        }
    }

    private async validateUserExists(userId: number): Promise<void> {
        const user = await this.prisma.userInfo.findUnique({
            where: { id: userId },
        });

        if (!user || user.delete_time) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
    }

    private async validateLeaveStatus(leaveId: number): Promise<void> {
        const leave = await this.prisma.leave.findUnique({
            where: { id: leaveId },
        });

        if (!leave || leave.delete_time) {
            throw new NotFoundException('Leave request not found or already deleted');
        }

        if (leave.status !== 'pending') {
            throw new BadRequestException('Cannot update status of non-pending leave');
        }
    }

    private async validateApprover(approverId: number): Promise<void> {
        const approver = await this.prisma.userInfo.findUnique({
            where: { id: approverId },
        });

        if (!approver || ![1, 2].includes(approver.role_id)) {
            throw new ForbiddenException('You do not have permission to approve leave requests');
        }
    }

    async createLeave(dto: CreateLeaveDto, userId: number) {
        await this.validateLeaveDates(dto.start_date, dto.end_date);
        await this.validateLeaveTypeExists(dto.leave_type_id);
        await this.validateUserExists(userId);

        return this.prisma.leave.create({
            data: {
                user_id: userId,
                leave_type_id: dto.leave_type_id,
                start_date: dto.start_date,
                end_date: dto.end_date,
                reason: dto.reason,
                created_by: userId,
            },
        });
    }

    async getMyLeaves(userId: number) {
        return this.prisma.leave.findMany({
            where: { user_id: userId, delete_time: null },
            orderBy: { created_at: 'desc' },
            include: {
                leaveType: true,
                createdBy: { select: { first_name: true, last_name: true } },
            },
        });
    }

    async getAllLeaves(currentUserId: number) {
        const currentUser = await this.prisma.userInfo.findUnique({
            where: { id: currentUserId },
        });

        if (!currentUser || ![1, 2].includes(currentUser.role_id)) {
            throw new ForbiddenException('Only admin or HR can view all leave requests');
        }

        return this.prisma.leave.findMany({
            where: { delete_time: null },
            orderBy: { created_at: 'desc' },
            include: {
                userInfo: {
                    select: { first_name: true, last_name: true, email: true },
                },
                leaveType: true,
                createdBy: { select: { first_name: true, last_name: true } },
            },
        });
    }

    async updateLeaveDetails(id: number, dto: UpdateLeaveDto, userId: number) {
        // Validate leave exists and belongs to user
        const leave = await this.prisma.leave.findUnique({
            where: { id },
            select: {
                id: true,
                user_id: true,
                leave_type_id: true,
                start_date: true,
                end_date: true,
                total_days: true,
                status: true,
                reason: true
            }
        });

        if (!leave) {
            throw new NotFoundException('Leave request not found');
        }

        if (leave.user_id !== userId) {
            throw new ForbiddenException('You can only update your own leave request');
        }

        // Validate leave type if provided
        if (dto.leave_type_id) {
            await this.validateLeaveTypeExists(dto.leave_type_id);
            if (typeof dto.leave_type_id !== 'string') {
                throw new BadRequestException('leave_type_id must be a string');
            }
        }

        // Validate dates
        if (dto.start_date || dto.end_date) {
            const startDate = dto.start_date || leave.start_date;
            const endDate = dto.end_date || leave.end_date;

            if (startDate > endDate) {
                throw new BadRequestException('start_date must be before or equal to end_date');
            }

            // Validate total_days matches date range
            const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            if (dto.total_days !== undefined && dto.total_days !== daysDiff) {
                throw new BadRequestException(`total_days (${dto.total_days}) does not match date range (${daysDiff} days)`);
            }

            await this.validateLeaveDates(startDate, endDate);
        }

        // Validate reason if provided
        if (dto.reason) {
            if (typeof dto.reason !== 'string') {
                throw new BadRequestException('reason must be a string');
            }
            if (dto.reason.length < 10) {
                throw new BadRequestException('reason must be at least 10 characters');
            }
            if (dto.reason.length > 500) {
                throw new BadRequestException('reason cannot exceed 500 characters');
            }
        }

        // Check if leave is already approved
        if (leave.status !== 'PENDING') {
            throw new ForbiddenException('Cannot update leave request that is not in PENDING status');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                start_date: dto.start_date,
                end_date: dto.end_date,
                reason: dto.reason,
            },
        });
    }

    async partialUpdate(id: number, data: Partial<any>): Promise<any> {
        // Validate each field, ถ้าผิด throw exception

        if (data.leave_type_id) {
            if (typeof data.leave_type_id !== 'string') {
                throw new BadRequestException('leave_type_id must be a string');
            }
            await this.validateLeaveTypeExists(data.leave_type_id);
        }

        if (data.start_date) {
            if (!(data.start_date instanceof Date)) {
                throw new BadRequestException('start_date must be a valid date');
            }
        }

        if (data.end_date) {
            if (!(data.end_date instanceof Date)) {
                throw new BadRequestException('end_date must be a valid date');
            }
        }

        if (data.reason) {
            if (typeof data.reason !== 'string') {
                throw new BadRequestException('reason must be a string');
            }
            if (data.reason.length < 10) {
                throw new BadRequestException('reason must be at least 10 characters');
            }
            if (data.reason.length > 500) {
                throw new BadRequestException('reason cannot exceed 500 characters');
            }
        }

        // Validate dates logic
        const currentLeave = await this.prisma.leave.findUnique({ where: { id } });
        const startDate = data.start_date || currentLeave.start_date;
        const endDate = data.end_date || currentLeave.end_date;

        if (startDate > endDate) {
            throw new BadRequestException('start_date must be before or equal to end_date');
        }

        // Validate overlapping dates
        await this.validateLeaveDates(startDate, endDate);

        // ถ้า validation ผ่านหมด ถึงจะอัปเดตจริง
        return await this.prisma.leave.update({
            where: { id },
            data: {
                ...data,
                update_time: new Date(),
            },
        });
    }


    async updateLeaveStatus(id: number, dto: UpdateLeaveStatusDto, approverId: number) {
        await this.validateLeaveStatus(id);
        await this.validateApprover(approverId);

        return this.prisma.leave.update({
            where: { id },
            data: {
                ...dto,
                update_time: new Date(),
            },
        });
    }

    async deleteLeave(id: number) {
        const leave = await this.prisma.leave.findUnique({ where: { id } });

        if (!leave || leave.delete_time) {
            throw new NotFoundException('Leave not found or already deleted');
        }

        return this.prisma.leave.update({
            where: { id },
            data: {
                delete_time: new Date(),
            },
        });
    }
}
