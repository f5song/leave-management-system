import { ApiProperty } from '@nestjs/swagger';
import { EDepartmentId } from '@common/constants/department.enum';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobTitleDto {
  @IsString()
  @IsNotEmpty()
  id: EJobTitleId;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  departmentId: EDepartmentId;
}
