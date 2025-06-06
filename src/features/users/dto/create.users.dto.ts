import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { EDepartmentId } from "@common/constants/department.enum";
import { IsOptional, IsString, IsNotEmpty, IsEmail, IsDateString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  nickName?: string;

  @IsString()
  avatarUrl?: string;

  @IsEmail()
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
}