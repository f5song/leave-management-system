import { IsDateString, IsOptional, IsString, Length, IsInt, Min } from 'class-validator';
import { LeaveType } from 'src/constants/leave-type.enum';

export class CreateLeaveDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  leaveTypeId: LeaveType;

  @IsString()
  @Length(10, 500)
  reason: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number; // อนุญาตให้ส่งหรือคำนวณเองก็ได้
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
  reason?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;
}

export class UpdateLeaveStatusDto {
  @IsString()
  status: 'pending' | 'approved' | 'rejected'; // กำหนดสถานะที่อนุญาต

  @IsOptional()
  @IsString()
  @Length(0, 255)
  comment?: string; // ความเห็นจากผู้อนุมัติ (ถ้ามี)
}
