import { Exclude, Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { DepartmentId } from 'src/constants/department.enum';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { JobTitleEntity } from 'src/database/entity/job-titles.entity';

export class CreateJobTitleDto {
  @IsString()
  @IsNotEmpty()
  id: JobTitleId;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  departmentId: DepartmentId;
}

export class UpdateJobTitleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  departmentId?: DepartmentId;
}

@Exclude()
export class JobTitleResponseDto {
  id: string;
  name: string;
  color: string;
  departmentId: string;
  departmentName: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
