import { IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsArray } from "class-validator";
import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { EDepartmentId } from "@common/constants/department.enum";

export class UpdateUserDto {
  @IsString()
  nickName?: string;

  @IsString()
  avatarUrl?: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  @IsString()
  jobTitleId?: EJobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: EDepartmentId;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsUUID()
  googleId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  approvedUsers?: string[];

  @IsOptional()
  @IsNumber()
  salary?: number;
}
