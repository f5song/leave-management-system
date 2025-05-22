import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, Not, LessThanOrEqual } from 'typeorm';
  import { LeaveEntity } from '../database/entity/leave.entity';
  import { UserInfoEntity } from '../database/entity/user-info.entity';
  import {
    CreateLeaveDto,
    UpdateLeaveDto,
    UpdateLeaveStatusDto,
  } from './leave.validation';
import { Leave } from '@prisma/client';
  
  
  @Injectable()
  export class LeaveService {
    constructor(
      @InjectRepository(LeaveEntity)
      private leaveRepository: Repository<LeaveEntity>,
  
      @InjectRepository(UserInfoEntity)
      private userRepository: Repository<UserInfoEntity>
    ) {}
  
    private async validateLeaveDates(startDate: Date, endDate: Date, excludeLeaveId?: number): Promise<void> {
      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before or equal to end date');
      }
  
      const overlaps = await this.leaveRepository.find({
        where: {
          start_date: LessThanOrEqual(endDate),
          end_date: LessThanOrEqual(startDate),
          delete_time: null,
          ...(excludeLeaveId ? { id: Not(excludeLeaveId) } : {}),
        },
      });
  
      if (overlaps.length > 0) {
        throw new BadRequestException('You already have a leave request during this period');
      }
    }
  
    private async validateLeaveTypeExists(leaveTypeId: string): Promise<void> {
      const leaveType = await this.leaveRepository.findOne({
        where: { id: Number(leaveTypeId) },
        relations: ['leaveType'],
      });
  
      if (!leaveType?.leaveType || leaveType.delete_time) {
        throw new NotFoundException(`Leave type with id ${leaveTypeId} not found`);
      }
    }
  
    private async validateUserExists(userId: number): Promise<void> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions'],
      });
  
      if (!user || user.delete_time) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
  
    private async validateLeaveStatus(leaveId: number): Promise<LeaveEntity> {
      const leave = await this.leaveRepository.findOne({
        where: { id: Number(leaveId) },
      });
  
      if (!leave || leave.delete_time) {
        throw new NotFoundException('Leave request not found');
      }
  
      if (leave.status !== 'pending') {
        throw new BadRequestException('Cannot update status of non-pending leave');
      }
  
      return leave;
    }
  
    private async validateApprover(approverId: number): Promise<void> {
      const approver = await this.userRepository.findOne({
        where: { id: approverId },
        relations: ['roles', 'roles.permissions'],
      });
  
      if (!approver || ![1, 2].includes(approver.role_id)) {
        throw new ForbiddenException('You do not have permission to approve leave requests');
      }
    }
  
    async createLeave(dto: CreateLeaveDto, userId: number): Promise<LeaveEntity> {
      const start = new Date(dto.start_date);
      const end = new Date(dto.end_date);
  
      await this.validateLeaveDates(start, end);
      await this.validateLeaveTypeExists(dto.leave_type_id);
      await this.validateUserExists(userId);
  
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
      const leave = this.leaveRepository.create({
        user_id: userId,
        leave_type_id: String(dto.leave_type_id),
        start_date: start,
        end_date: end,
        total_days: totalDays,
        reason: dto.reason,
        status: 'pending',
      });
  
      return await this.leaveRepository.save(leave);
    }
  
    async getMyLeaves(userId: number): Promise<LeaveEntity[]> {
      return this.leaveRepository.find({
        where: { user: { id: userId }, delete_time: null },
        relations: ['user', 'leaveType', 'creator'],
      });
    }
  
    async getAllLeaves(currentUserId: number): Promise<LeaveEntity[]> {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
      });
  
      if (!currentUser || ![1, 2].includes(currentUser.role_id)) {
        throw new ForbiddenException('Only admin or HR can view all leave requests');
      }
  
      return this.leaveRepository.find({
        where: { delete_time: null },
        relations: ['user', 'leaveType', 'creator'],
      });
    }
  
    async updateLeaveDetails(id: number, dto: UpdateLeaveDto, userId: number): Promise<LeaveEntity> {
      const existingLeave = await this.leaveRepository.findOne({
        where: { id: Number(id) },
        relations: ['user', 'leaveType']
      });

      if (!existingLeave) {
        throw new NotFoundException(`Leave with ID ${id} not found`);
      }

      if (existingLeave.user.id !== userId) {
        throw new ForbiddenException('You can only update your own leave requests');
      }

      if (existingLeave.status !== 'pending') {
        throw new ForbiddenException('Cannot update leave request that is not pending');
      }

      // Update only the fields that were provided in the DTO
      if (dto.start_date) {
        existingLeave.start_date = new Date(dto.start_date);
      }
      if (dto.end_date) {
        existingLeave.end_date = new Date(dto.end_date);
      }
      if (dto.leave_type_id) {
        existingLeave.leave_type_id = String(dto.leave_type_id);
      }
      if (dto.reason) {
        existingLeave.reason = dto.reason;
      }
      if (dto.total_days !== undefined) {
        existingLeave.total_days = Number(dto.total_days);
      }
      existingLeave.update_time = new Date();

      await this.validateLeaveDates(existingLeave.start_date, existingLeave.end_date, id);

      return await this.leaveRepository.save(existingLeave);
    }
  
    async updateLeaveStatus(id: number, dto: UpdateLeaveStatusDto, approverId: number): Promise<LeaveEntity> {
      const leave = await this.validateLeaveStatus(id);
      await this.validateApprover(approverId);
  
      leave.status = dto.status;
      leave.update_time = new Date();
  
      return await this.leaveRepository.save(leave);
    }
  
    async deleteLeave(id: number): Promise<LeaveEntity> {
      const leave = await this.leaveRepository.findOne({ where: { id } });
  
      if (!leave || leave.delete_time) {
        throw new NotFoundException('Leave not found or already deleted');
      }
  
      leave.delete_time = new Date();
      return await this.leaveRepository.save(leave);
    }
  }
  