import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { DepartmentEntity } from '../database/entity/departments.entity';
import { DepartmentId } from 'src/constants/department.enum';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class DepartmentResponseDto {
  id: DepartmentId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

