import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobTitleDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  department_id: string;
}

export class UpdateJobTitleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  department_id?: string;
}
