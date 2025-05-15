import { IsString, IsDate, IsInt, IsOptional } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  title: string;

  @IsDate()
  start_date: Date;

  @IsDate()
  end_date: Date;

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
