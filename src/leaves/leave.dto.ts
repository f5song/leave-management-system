import { IsDateString, IsOptional, IsString, Length, IsInt, Min, IsEnum } from 'class-validator';
import { LeaveType } from 'src/constants/leave-type.enum';
import { LeaveStatus } from 'src/constants/leave-status.enum';
import { LeaveEntity } from 'src/database/entity/leaves.entity';
import { UserEntity } from 'src/database/entity/users.entity';

export class CreateLeaveDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  leaveTypeId: LeaveType;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;
}

export class UpdateLeaveDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  leaveTypeId?: LeaveType;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;
}

export class UpdateLeaveStatusDto {
  @IsEnum(LeaveStatus)
  status: LeaveStatus;

  // @IsOptional()
  // @IsString()
  // @Length(0, 255)
  // comment?: string; // ความเห็นจากผู้อนุมัติ (ถ้ามี)
}

export class LeaveResponseDto {
  id: string;
  startDate: Date;
  endDate: Date;
  status: string;
  description: string;
  createdBy: UserEntity;
  createdAt: Date;
  updatedAt: Date;

  constructor(entity: LeaveEntity) {
    this.id = entity.id;
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.status = entity.status;
    this.description = entity.description;
    this.createdBy = entity.createdBy;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

