import { ApiProperty } from '@nestjs/swagger';
import { EDepartmentId } from '@src/common/constants/department.enum';
import { IsOptional, IsString } from 'class-validator';

export class UpdateJobTitleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  departmentId?: EDepartmentId;
}