import { IsOptional, IsDateString, IsString, Length, IsInt, Min } from "class-validator";

export class UpdateHolidayDto {
  @IsString()
  @Length(2, 255)
  title: string;

  @IsString()
  @Length(2, 255)
  color: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDays?: number;
}
