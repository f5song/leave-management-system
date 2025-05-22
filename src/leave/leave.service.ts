import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './leave.entity';
import { User } from '../auth/user.entity';
import { CreateLeaveDto, UpdateLeaveDto, UpdateLeaveStatusDto } from './dto';

@Injectable()
export class LeaveService {
    constructor(
        @InjectRepository(Leave)
        private leaveRepository: Repository<Leave>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    private async validateLeaveDates(startDate: Date, endDate: Date): Promise<void> {
        if (startDate > endDate) {
            throw new BadRequestException('Start date must be before or equal to end date');
        }

        // Check for overlapping leaves
        const overlappingLeaves = await this.leaveRepository.find({
            where: {
                start_date: {
                    lte: endDate,
                },
                end_date: {
                    gte: startDate,
                },
                delete_time: null,
            },
            relations: ['user']
        });

        if (overlappingLeaves.length > 0) {
            throw new BadRequestException('You already have a leave request during this period');
        }
    }

    private async validateLeaveTypeExists(leaveTypeId: string): Promise<void> {
        const leaveType = await this.leaveRepository.findOne({
            where: { id: leaveTypeId },
            relations: ['leaveType']
        });

        if (!leaveType || leaveType.delete_time) {
            throw new NotFoundException(`Leave type with id ${leaveTypeId} not found`);
        }
    }

    private async validateUserExists(userId: number): Promise<void> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['roles', 'roles.permissions']
        });

        if (!user || user.delete_time) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }
    }

    private async validateLeaveStatus(leaveId: number): Promise<void> {
        const leave = await this.leaveRepository.findOne({
            where: { id: leaveId },
            relations: ['user']
        });

        if (!leave || leave.delete_time) {
            throw new NotFoundException('Leave request not found or already deleted');
        }

        if (leave.status !== 'pending') {
            throw new BadRequestException('Cannot update status of non-pending leave');
        }
    }

    private async validateApprover(approverId: number): Promise<void> {
        const approver = await this.userRepository.findOne({
            where: { id: approverId },
            relations: ['roles', 'roles.permissions']
        });

        if (!approver || ![1, 2].includes(approver.role_id)) {
            throw new ForbiddenException('You do not have permission to approve leave requests');
        }
    }

    async createLeave(dto: CreateLeaveDto, userId: number): Promise<Leave> {
        await this.validateLeaveDates(dto.start_date, dto.end_date);
        await this.validateLeaveTypeExists(dto.leave_type_id);
        await this.validateUserExists(userId);

        // Calculate total days
        const totalDays = Math.ceil((dto.end_date.getTime() - dto.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Create leave
        const leave = await this.leaveRepository.save({
            user: { id: userId },
            leaveType: { id: dto.leave_type_id },
            start_date: dto.start_date,
            end_date: dto.end_date,
            total_days: totalDays,
            reason: dto.reason,
            status: 'pending',
            creator: { id: userId }
        });

        return leave;
    }

    async getMyLeaves(userId: number): Promise<Leave[]> {
        return this.leaveRepository.find({
            where: { user: { id: userId }, delete_time: null },
            relations: ['user', 'leaveType', 'creator']
        });
    }

    async getAllLeaves(currentUserId: number): Promise<Leave[]> {
        const currentUser = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['roles', 'roles.permissions']
        });

        if (!currentUser || ![1, 2].includes(currentUser.role_id)) {
            throw new ForbiddenException('Only admin or HR can view all leave requests');
        }

        return this.leaveRepository.find({
            where: { delete_time: null },
            relations: ['user', 'leaveType', 'creator']
        });
    }

    async updateLeaveDetails(id: number, dto: UpdateLeaveDto, userId: number): Promise<Leave> {
        // Validate leave exists and belongs to user
        const leave = await this.leaveRepository.findOne({
            where: { id },
            relations: ['user']
        });

        if (!leave) {
            throw new NotFoundException('Leave request not found');
        }

        if (leave.user.id !== userId) {
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
        if (leave.status !== 'pending') {
            throw new ForbiddenException('Cannot update leave request that is not in pending status');
        }

        // Calculate total days
        const totalDays = Math.ceil((dto.end_date.getTime() - dto.start_date.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Update leave
        const updatedLeave = await this.leaveRepository.update(id, {
            leaveType: { id: dto.leave_type_id },
            start_date: dto.start_date,
            end_date: dto.end_date,
            total_days: totalDays,
            reason: dto.reason
        });

        return this.leaveRepository.findOne({
            where: { id },
            relations: ['user', 'leaveType', 'creator']
        });
    }

    async partialUpdate(id: number, data: Partial<any>): Promise<Leave> {
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
        const currentLeave = await this.leaveRepository.findOne({ where: { id } });
        const startDate = data.start_date || currentLeave.start_date;
        const endDate = data.end_date || currentLeave.end_date;

        if (startDate > endDate) {
            throw new BadRequestException('start_date must be before or equal to end_date');
        }

        // Validate overlapping dates
        await this.validateLeaveDates(startDate, endDate);

        // ถ้า validation ผ่านหมด ถึงจะอัปเดตจริง
        return await this.leaveRepository.update({
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

        return this.leaveRepository.update({
            where: { id },
            data: {
                ...dto,
                update_time: new Date(),
            },
        });
    }

    async deleteLeave(id: number) {
        const leave = await this.leaveRepository.findOne({ where: { id } });

        if (!leave || leave.delete_time) {
            throw new NotFoundException('Leave not found or already deleted');
        }

        return this.leaveRepository.update({
            where: { id },
            data: {
                delete_time: new Date(),
            },
        });
    }
}
