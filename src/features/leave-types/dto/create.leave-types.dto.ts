import { IsOptional, IsNotEmpty, IsString, Length } from "class-validator";
import { ELeaveType } from "@common/constants/leave-type.enum";

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  id: ELeaveType;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}   