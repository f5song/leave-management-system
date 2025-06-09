import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100, {
    message: 'Department name must be between 2 and 100 characters',
  })
  name: string;

  @IsOptional()
  @IsString()
  color?: string;

}