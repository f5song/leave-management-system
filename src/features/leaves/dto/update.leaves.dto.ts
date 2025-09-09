import { IsDateString, IsOptional, IsString, Length, IsInt, Min, IsEnum } from "class-validator";
import { ELeaveType } from "@common/constants/leave-type.enum";
import { EStatus } from "@src/common/constants/status.enum";

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

  @IsOptional()
  @IsEnum(EStatus)
  status?: EStatus;

  @IsOptional()
  @IsString()
  title?: string;
  
}
