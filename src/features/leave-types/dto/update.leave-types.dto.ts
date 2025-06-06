import { IsOptional, IsString, Length } from "class-validator";
import { ELeaveType } from "@common/constants/leave-type.enum";

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  id?: ELeaveType;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}