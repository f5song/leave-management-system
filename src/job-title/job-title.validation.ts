import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { DepartmentId } from 'src/constants/department.enum';
import { JobTitleId } from 'src/constants/jobtitle.enum';

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
