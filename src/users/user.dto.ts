import { IsNotEmpty, IsString, IsArray, MinLength, IsEmail, IsNumber, IsOptional, IsDate } from 'class-validator';
import { DepartmentId } from 'src/constants/department.enum';
import { JobTitleId } from 'src/constants/jobtitle.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

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
  @IsNotEmpty()
  roleId: string;

  @IsOptional()
  @IsString()
  jobTitleId?: JobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: DepartmentId;

  @IsOptional()
  @IsDate()
  birthDate?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  jobTitleId?: JobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: DepartmentId;

  @IsOptional()
  @IsDate()
  birthDate?: Date;
}

