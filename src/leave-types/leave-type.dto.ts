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

@Exclude()
export class LeaveTypeResponseDto {
  @Expose()
  id: LeaveType;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;

  @Expose()
  leaves: LeaveEntity[];

  constructor(entity: LeaveTypeEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}
