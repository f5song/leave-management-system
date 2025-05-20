import { IsString, IsDate, IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateHolidayDto {
  @IsInt()
  id?: number;

  @IsString()
  title: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsInt()
  total_days: number;

  @IsString()
  color: string;

  @IsOptional()
  @IsInt()
  created_by?: number;
}

export class UpdateHolidayDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDate()
  start_date?: Date;

  @IsOptional()
  @IsDate()
  end_date?: Date;

  @IsOptional()
  @IsInt()
  total_days?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  created_by?: number;
}
