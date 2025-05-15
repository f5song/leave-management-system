import { IsString, Length, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @Length(1, 20)
  id: string;

  @IsString()
  name: string;
}
export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;
}
