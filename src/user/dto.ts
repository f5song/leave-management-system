import { IsString, IsOptional, IsNumber, IsDate, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsOptional()
  @IsString()
  job_title_id?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsDate()
  birth_date?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsString()
  job_title_id?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsDate()
  birth_date?: Date;
}
