import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateJobTitleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  department_id?: string;
}

export class UpdateJobTitleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  department_id?: string;
}
