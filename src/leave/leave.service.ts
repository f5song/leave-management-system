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
  
  
  @Injectable()
  export class LeaveService {
    constructor(
      @InjectRepository(LeaveEntity)
      private leaveRepository: Repository<LeaveEntity>,
  
      @InjectRepository(UserInfoEntity)
      private userRepository: Repository<UserInfoEntity>
    ) {}
  
    private async validateLeaveDates(startDate: Date, endDate: Date, excludeLeaveId?: string): Promise<void> {
      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before or equal to end date');
      }
  
      const overlaps = await this.leaveRepository.find({
        where: {
          startDate: LessThanOrEqual(endDate),
          endDate: LessThanOrEqual(startDate),
          deleteTime: null,
          ...(excludeLeaveId ? { id: Not(excludeLeaveId) } : {}),
        },
      });
  
      if (overlaps.length > 0) {
        throw new BadRequestException('You already have a leave request during this period');
      }
    }
  
    private async validateLeaveTypeExists(leaveTypeId: string): Promise<void> {
      const leaveType = await this.leaveRepository.findOne({
        where: { id: leaveTypeId },
        relations: ['leaveType'],
      });
  
      if (!leaveType?.leaveType || leaveType.deleteTime) {
        throw new NotFoundException(`Leave type with id ${leaveTypeId} not found`);
      }
    }
  
    private async validateUserExists(userId: string): Promise<void> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['roles', 'roles.permissions'],
      });
  
      if (!user || user.deleteTime) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
    }
  
    private async validateLeaveStatus(leaveId: string): Promise<LeaveEntity> {
      const leave = await this.leaveRepository.findOne({
        where: { id: leaveId },
      });
  
      if (!leave || leave.deleteTime) {
        throw new NotFoundException('Leave request not found');
      }
  
      if (leave.status !== 'pending') {
        throw new BadRequestException('Cannot update status of non-pending leave');
      }
  
      return leave;
    }
  
    private async validateApprover(approverId: string): Promise<void> {
      const approver = await this.userRepository.findOne({
        where: { id: approverId },
        relations: ['roles', 'roles.permissions'],
      });
  
      if (!approver || approver.roleId !== "Admin") {
        throw new ForbiddenException('You do not have permission to approve leave requests');
      }
    }
  
    async createLeave(dto: CreateLeaveDto, userId: string): Promise<LeaveEntity> {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
  
      await this.validateLeaveDates(start, end);
      await this.validateLeaveTypeExists(dto.leaveTypeId);
      await this.validateUserExists(userId);
  
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
      const leave = this.leaveRepository.create({
        userId: userId,
        leaveTypeId: String(dto.leaveTypeId),
        startDate: start,
        endDate: end,
        totalDays: totalDays,
        reason: dto.reason,
        status: 'pending',
      });
  
      return await this.leaveRepository.save(leave);
    }
  
    async getMyLeaves(userId: string): Promise<LeaveEntity[]> {
      return this.leaveRepository.find({
        where: { userId: userId, deleteTime: null },
        relations: ['user', 'leaveType', 'creator'],
      });
    }
  
    async getAllLeaves(currentUserId: string): Promise<LeaveEntity[]> {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
      });
  
      if (!currentUser || currentUser.roleId !== "Admin") {
        throw new ForbiddenException('Only admin can view all leave requests');
      }
  
      return this.leaveRepository.find({
        where: { deleteTime: null },
        relations: ['user', 'leaveType', 'creator'],
      });
    }
  
    async updateLeaveDetails(id: string, dto: UpdateLeaveDto, userId: string): Promise<LeaveEntity> {
      const existingLeave = await this.leaveRepository.findOne({
        where: { id },
        relations: ['user', 'leaveType']
      });

      if (!existingLeave) {
        throw new NotFoundException(`Leave with ID ${id} not found`);
      }

      if (existingLeave.userId !== userId) {
        throw new ForbiddenException('You can only update your own leave requests');
      }

      if (existingLeave.status !== 'pending') {
        throw new ForbiddenException('Cannot update leave request that is not pending');
      }

      // Update only the fields that were provided in the DTO
      if (dto.startDate) {
        existingLeave.startDate = new Date(dto.startDate);
      }
      if (dto.endDate) {
        existingLeave.endDate = new Date(dto.endDate);
      }
      if (dto.leaveTypeId) {
        existingLeave.leaveTypeId = String(dto.leaveTypeId);
      }
      if (dto.reason) {
        existingLeave.reason = dto.reason;
      }
      if (dto.totalDays !== undefined) {
        existingLeave.totalDays = Number(dto.totalDays);
      }
      existingLeave.updateTime = new Date();

      await this.validateLeaveDates(existingLeave.startDate, existingLeave.endDate, id);

      return await this.leaveRepository.save(existingLeave);
    }
  
    async updateLeaveStatus(id: string, dto: UpdateLeaveStatusDto, approverId: string): Promise<LeaveEntity> {
      const leave = await this.validateLeaveStatus(id);
      await this.validateApprover(approverId);
  
      leave.status = dto.status;
      leave.updateTime = new Date();
  
      return await this.leaveRepository.save(leave);
    }
  
    async deleteLeave(id: string): Promise<LeaveEntity> {
      const leave = await this.leaveRepository.findOne({ where: { id } });
  
      if (!leave || leave.deleteTime) {
        throw new NotFoundException('Leave not found or already deleted');
      }
  
      leave.deleteTime = new Date();
      return await this.leaveRepository.save(leave);
    }
  }
  