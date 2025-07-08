import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { LeaveEntity } from '../../database/entity/leaves.entity';
import { UserEntity } from '../../database/entity/users.entity';
import { LeaveTypeEntity } from '../../database/entity/leave-types.entity';
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
    private userRepository: Repository<UserEntity>,

    @InjectRepository(LeaveTypeEntity)
    private leaveTypeRepository: Repository<LeaveTypeEntity>
  ) { }

  toLeaveResponseDto(
    entity: LeaveEntity
  ): LeaveResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      leaveTypeId: entity.leaveTypeId,
      title: entity.title,
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

  private async validateLeaveDates(startDate: Date, endDate: Date, excludeLeaveId?: string, userId?: string): Promise<void> {
    if (startDate > endDate) {
      throw new HttpException({
        code: '0406',
        message: errorMessage['0406'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    const overlaps = await this.leaveRepository.find({
      where: {
        userId: userId,
        startDate: LessThanOrEqual(endDate),
        endDate: MoreThanOrEqual(startDate),
        deletedAt: null,
        ...(excludeLeaveId ? { id: Not(excludeLeaveId) } : {}),
      },
    });


    if (overlaps.length > 0) {
      throw new HttpException({
        code: '0407',
        message: errorMessage['0407'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateLeaveTypeExists(leaveTypeId: ELeaveType): Promise<void> {
    const leaveType = await this.leaveTypeRepository.findOne({
      select: ['id', 'deletedAt'],
      where: { id: leaveTypeId },
    });


    if (!leaveType || leaveType.deletedAt) {
      throw new HttpException({
        code: '0405',
        message: 'Leave type not found',
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      select: ['id', 'deletedAt'],
      where: { id: userId },
    });

    if (!user || user.deletedAt) {
      throw new HttpException({
        code: '0405',
        message: 'User not found',
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
        code: '0405',
        message: errorMessage['0405'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (leave.status !== ELeaveStatus.PENDING) {
      throw new HttpException({
        code: '0405',
        message: errorMessage['0405'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return leave;
  }

  private async validateApprover(approverId: string): Promise<void> {
    const approver = await this.userRepository.findOne({
      select: ['id', 'deletedAt'],
      where: { id: approverId },
    });

    if (!approver || approver.deletedAt) {
      throw new HttpException({
        code: '0405',
        message: errorMessage['0405'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async createLeave(id: string, dto: CreateLeaveDto, userId: string): Promise<LeaveEntity> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    await this.validateLeaveDates(start, end, undefined, userId);
    await this.validateLeaveTypeExists(dto.leaveTypeId);
    await this.validateUserExists(userId);

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    console.log("start date", start);
    console.log("end date", end);

    const leave = this.leaveRepository.create({
      userId: userId,
      leaveTypeId: dto.leaveTypeId,
      title: dto.title,
      description: dto.description,
      startDate: start,
      endDate: end,
      totalDays: totalDays,
      status: ELeaveStatus.PENDING,
      createdById: id,
    });

    return await this.leaveRepository.save(leave);
  }

  async getMyLeaves(userId: string): Promise<LeaveResponseDto[]> {
    return this.leaveRepository.find({
      select: ['id', 'userId', 'leaveTypeId', 'title', 'description', 'startDate', 'endDate', 'totalDays', 'status'],
      where: {
        userId: userId,
        deletedAt: null,
      },
    });
  }

  async getAllLeaves(start?: string, end?: string): Promise<LeaveResponseDto[]> {

    return this.leaveRepository.find({
      relations: ['userInfo', 'leaveType'],
      select: ['id', 'userId', 'leaveTypeId', 'title', 'description', 'startDate', 'endDate', 'totalDays', 'status','userInfo'],
      where: {
        ...(start && end ? {
          startDate: LessThanOrEqual(new Date(end)),
          endDate: MoreThanOrEqual(new Date(start)),
        } : {}),
      },
    });


  }





  async updateLeaveDetails(leaveId: string, dto: UpdateLeaveDto, userId: string): Promise<LeaveEntity> {
    const existingLeave = await this.leaveRepository.findOne({
      select: ['id', 'userId', 'status'],
      where: { id: leaveId },
      relations: ['userInfo', 'leaveType']
    });

    if (!existingLeave) {
      throw new HttpException({
        code: '0401',
        message: errorMessage['0401'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (existingLeave.userInfo.id !== userId) {
      throw new HttpException({
        code: '0408',
        message: errorMessage['0408'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (existingLeave.status !== ELeaveStatus.PENDING) {
      throw new HttpException({
        code: '0409',
        message: errorMessage['0409'],
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
    if (dto.title) {
      existingLeave.title = dto.title;
    }
    existingLeave.updatedAt = new Date();

    await this.validateLeaveDates(existingLeave.startDate, existingLeave.endDate, leaveId);

    return await this.leaveRepository.save(existingLeave);
  }

  async updateLeaveStatus(id: string, dto: UpdateLeaveDto, approverId: string): Promise<LeaveEntity> {
    const leave = await this.validateLeaveStatus(id);
    await this.validateApprover(approverId);

    leave.status = dto.status;
    leave.updatedAt = new Date();
    leave.actionBy = approverId;
    leave.actionAt = new Date();

    return await this.leaveRepository.save(leave);
  }

  async deleteLeave(id: string): Promise<LeaveEntity> {
    const leave = await this.leaveRepository.findOne({ where: { id } });

    if (!leave || leave.deletedAt) {
      throw new HttpException({
        code: '0405',
        message: errorMessage['0405'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    leave.deletedAt = new Date();
    return await this.leaveRepository.save(leave);
  }

  async getLeaveId(id: string): Promise<LeaveEntity> {
    console.log('id:', id);
    const leave = await this.leaveRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    console.log('leave:', leave);

    if (!leave) {
      throw new HttpException({
        code: '0401',
        message: errorMessage['0401'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (leave.deletedAt) {
      throw new HttpException({
        code: '0401',
        message: errorMessage['0401'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return leave;
  }

}
