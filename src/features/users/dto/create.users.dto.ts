import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { EDepartmentId } from "@common/constants/department.enum";
import { IsOptional, IsString, IsNotEmpty, IsEmail, IsDateString, IsNumber } from "class-validator";
import { ERole } from "@common/constants/roles.enum";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  nickName?: string;

  // @IsString()
  // avatarUrl?: string;


  @IsString()
  @IsNotEmpty()
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
  @Type(() => Number)
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}