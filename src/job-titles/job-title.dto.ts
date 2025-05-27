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
  departmentId: DepartmentId;
}

export class UpdateJobTitleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  departmentId?: DepartmentId;
}

@Exclude()
export class JobTitleResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  departmentId: string;

  @Expose()
  departmentName: string | null;

  constructor(jobTitle: JobTitleEntity) {
    this.id = jobTitle.id;
    this.name = jobTitle.name;
    this.departmentId = jobTitle.departmentId;
    this.departmentName = jobTitle.department ? jobTitle.department.name : null;
  }
}
