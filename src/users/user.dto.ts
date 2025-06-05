import { IsNotEmpty, IsString, IsArray, MinLength, IsEmail, IsNumber, IsOptional, IsDate, IsUUID, IsDateString } from 'class-validator';
import { DepartmentId } from 'src/constants/department.enum';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { DepartmentEntity } from 'src/database/entity/departments.entity';
import { HolidayEntity } from 'src/database/entity/holidays.entity';
import { JobTitleEntity } from 'src/database/entity/job-titles.entity';
import { LeaveEntity } from 'src/database/entity/leaves.entity';
import { PermissionEntity } from 'src/database/entity/permissions.entity';
import { RoleEntity } from 'src/database/entity/roles.entity';
import { UsersFacilityRequestEntity } from 'src/database/entity/users-facility-requests.entity';
import { UsersItemRequestEntity } from 'src/database/entity/users-items-requests.entity';
import { UserEntity } from 'src/database/entity/users.entity';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsNotEmpty()
  // @IsString()
  // password: string;
}

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
  jobTitleId?: JobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: DepartmentId;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}

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
  jobTitleId?: JobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: DepartmentId;

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

export class PatchUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  nickName?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  jobTitleId?: JobTitleId;

  @IsOptional()
  @IsString()
  departmentId?: DepartmentId;

  @IsOptional()
  @IsString()
  employeeCode?: string;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsUUID()
  googleId?: string;

  @IsOptional()
  @IsNumber()
  salary?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  approvedUsers?: string[];
}

export class UserResponseDto {
  id: string;
  employeeCode: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  avatarUrl?: string;
  birthDate: Date;
  salary: number;
  roleId: string;
  jobTitleId: JobTitleId;
  departmentId: DepartmentId;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
