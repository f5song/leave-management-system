import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThanOrEqual } from 'typeorm';
import { LeaveEntity } from '../../database/entity/leaves.entity';
import { UserEntity } from '../../database/entity/users.entity';
import {
  CreateLeaveDto
} from './dto/create.leaves.dto';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { ELeaveStatus } from '@common/constants/leave-status.enum';
import { LeaveResponseDto } from './respones/leaves.respones.dto';
import { UpdateLeaveDto } from './dto/update.leaves.dto';
import { ERole } from '@src/common/constants/roles.enum';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(LeaveEntity)
    private leaveRepository: Repository<LeaveEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) { }

  toLeaveResponseDto(
    entity: LeaveEntity
  ): LeaveResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      leaveTypeId: entity.leaveTypeId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      totalDays: entity.totalDays,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  private async validateLeaveDates(startDate: Date, endDate: Date, excludeLeaveId?: string): Promise<void> {
    if (startDate > endDate) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    const overlaps = await this.leaveRepository.find({
      where: {
        startDate: LessThanOrEqual(endDate),
        endDate: LessThanOrEqual(startDate),
        deletedAt: null,
        ...(excludeLeaveId ? { id: Not(excludeLeaveId) } : {}),
      },
    });

    if (overlaps.length > 0) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateLeaveTypeExists(leaveTypeId: string): Promise<void> {
    const leaveType = await this.leaveRepository.findOne({
      where: { id: leaveTypeId },
      relations: ['leaveType'],
    });

    if (!leaveType?.leaveType || leaveType.deletedAt) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || user.deletedAt) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateLeaveStatus(leaveId: string): Promise<LeaveEntity> {
    const leave = await this.leaveRepository.findOne({
      where: { id: leaveId },
    });

    if (!leave || leave.deletedAt) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (leave.status !== ELeaveStatus.PENDING) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return leave;
  }

  private async validateApprover(approverId: string): Promise<void> {
    const approver = await this.userRepository.findOne({
      where: { id: approverId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!approver || approver.roleId !== ERole.ADMIN) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
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
      leaveTypeId: dto.leaveTypeId,
      startDate: start,
      endDate: end,
      totalDays: totalDays,
      description: dto.description,
      status: ELeaveStatus.PENDING,
    });

    return await this.leaveRepository.save(leave);
  }

  async getMyLeaves(userId: string): Promise<LeaveEntity[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return this.leaveRepository.find({
      where: {
        userId: userId,
        deletedAt: null,
      },
      relations: ['user', 'leaveType', 'creator'],
    });
  }

  async getAllLeaves(currentUserId: string): Promise<LeaveEntity[]> {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['role', 'role.permissions'],
    });

    if (!currentUser) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (currentUser.role.id !== ERole.ADMIN) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return this.leaveRepository.find({
      where: { deletedAt: null },
      relations: ['user', 'leaveType', 'creator'],
    });
  }





  async updateLeaveDetails(id: string, dto: UpdateLeaveDto, userId: string): Promise<LeaveEntity> {
    const existingLeave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['user', 'leaveType']
    });

    if (!existingLeave) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (existingLeave.userId !== userId) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (existingLeave.status !== ELeaveStatus.PENDING) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    // Update only the fields that were provided in the DTO
    if (dto.startDate) {
      existingLeave.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      existingLeave.endDate = new Date(dto.endDate);
    }
    if (dto.leaveTypeId) {
      existingLeave.leaveTypeId = dto.leaveTypeId;
    }
    if (dto.description) {
      existingLeave.description = dto.description;
    }
    if (dto.totalDays !== undefined) {
      existingLeave.totalDays = Number(dto.totalDays);
    }
    existingLeave.updatedAt = new Date();

    await this.validateLeaveDates(existingLeave.startDate, existingLeave.endDate, id);

    return await this.leaveRepository.save(existingLeave);
  }

  async updateLeaveStatus(id: string, dto: UpdateLeaveDto, approverId: string): Promise<LeaveEntity> {
    const leave = await this.validateLeaveStatus(id);
    await this.validateApprover(approverId);

    leave.status = dto.status;
    leave.updatedAt = new Date();

    return await this.leaveRepository.save(leave);
  }

  async deleteLeave(id: string): Promise<LeaveEntity> {
    const leave = await this.leaveRepository.findOne({ where: { id } });

    if (!leave || leave.deletedAt) {
      throw new HttpException({
        code: '0302',
        message: errorMessage['0302'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    leave.deletedAt = new Date();
    return await this.leaveRepository.save(leave);
  }
}
