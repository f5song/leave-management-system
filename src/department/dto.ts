import { IsString, Length, IsOptional, IsNotEmpty, IsDate, IsUUID } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @Length(1, 20)
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsDate()
  update_time?: Date;
}
