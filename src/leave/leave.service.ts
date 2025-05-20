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
        });

        if (!leave) {
            throw new NotFoundException('Leave request not found');
        }

        if (leave.user_id !== userId) {
            throw new ForbiddenException('You can only update your own leave request');
        }

        // Only validate dates if they're being updated
        if (dto.start_date || dto.end_date) {
            await this.validateLeaveDates(dto.start_date || leave.start_date, dto.end_date || leave.end_date);
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

    async updateLeaveStatus(id: number, dto: UpdateLeaveStatusDto, approverId: number) {
        await this.validateLeaveStatus(id);
        await this.validateApprover(approverId);

        return this.prisma.leave.update({
            where: { id },
            data: {
                status: dto.status,
                update_time: new Date(),
                created_by: approverId,
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
