import { IsDateString, IsOptional, IsString, Length, IsInt, Min, IsEnum } from "class-validator";
import { ELeaveType } from "@common/constants/leave-type.enum";
import { ELeaveStatus } from "@common/constants/leave-status.enum";

export class UpdateLeaveDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  leaveTypeId?: ELeaveType;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;

  @IsEnum(ELeaveStatus)
  status: ELeaveStatus;
}


export class UpdateLeaveStatusDto {
  @IsEnum(ELeaveStatus)
  status: ELeaveStatus;

  // @IsOptional()
  // @IsString()
  // @Length(0, 255)
  // comment?: string; // ความเห็นจากผู้อนุมัติ (ถ้ามี)
}
