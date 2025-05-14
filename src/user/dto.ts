import { IsEmail, IsNotEmpty, IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @IsNotEmpty()
  @IsString()
  job_title_id: string;

  @IsNotEmpty()
  @IsString()
  department_id: string;
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
  @IsString()
  job_title_id?: string;

  @IsOptional()
  @IsString()
  department_id?: string;

  @IsOptional()
  @IsNumber()
  role_id?: number;
}
