import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';
import { LeaveType } from 'src/constants/leave-type.enum';

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
