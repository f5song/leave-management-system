import { IsNumber, IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsArray } from "class-validator";
import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { EDepartmentId } from "@common/constants/department.enum";
import { ERole } from "@common/constants/roles.enum";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nickName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  roleId: ERole;

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
  @IsArray()
  @IsUUID('4', { each: true })
  approvedUsers?: string[];

  @IsOptional()
  @IsNumber()
  salary?: number;

  
}

