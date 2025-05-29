import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { LeaveType } from 'src/constants/leave-type.enum';
import { LeaveTypeEntity } from 'src/database/entity/leave-types.entity';
import { LeaveEntity } from 'src/database/entity/leaves.entity';

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  id: LeaveType;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  id?: LeaveType;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class LeaveTypeResponseDto {
  id: LeaveType;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leaves: LeaveEntity[];
}
