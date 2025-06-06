import { IsDateString, IsString, Length, IsOptional, IsInt, Min } from "class-validator";
import { ELeaveType } from "@common/constants/leave-type.enum";

export class CreateLeaveDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  leaveTypeId: ELeaveType;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;
}