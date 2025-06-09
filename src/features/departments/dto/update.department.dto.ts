import { IsOptional, IsString, Length } from "class-validator";

export class UpdateDepartmentDto {

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  @Length(2, 100, {
    message: 'Department name must be between 2 and 100 characters',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(6, 7, {
    message: 'Color must be a valid HEX color code (e.g., #FF0000)',
  })
  color?: string;

}