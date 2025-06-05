import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { DepartmentId } from 'src/constants/department.enum';
import { UserEntity } from 'src/database/entity/users.entity';
import { JobTitleEntity } from 'src/database/entity/job-titles.entity';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  color?: string;


}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

}

export class DepartmentResponseDto {
  id: DepartmentId;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  users: UserEntity[];
  jobTitles: JobTitleEntity[];
}

export class PartialUpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

}

