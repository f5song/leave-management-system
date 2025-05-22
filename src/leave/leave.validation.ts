import { IsDateString, IsOptional, IsString, Length, IsInt, Min } from 'class-validator';

export class CreateLeaveDto {
  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsString()
  leave_type_id: string;

  @IsString()
  @Length(10, 500)
  reason: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  total_days?: number; // อนุญาตให้ส่งหรือคำนวณเองก็ได้
}

export class UpdateLeaveDto {
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  leave_type_id?: string;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  reason?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  total_days?: number;
}

export class UpdateLeaveStatusDto {
  @IsString()
  status: 'pending' | 'approved' | 'rejected'; // กำหนดสถานะที่อนุญาต

  @IsOptional()
  @IsString()
  @Length(0, 255)
  comment?: string; // ความเห็นจากผู้อนุมัติ (ถ้ามี)
}
