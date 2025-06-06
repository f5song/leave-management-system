import { IsDateString, IsOptional, IsString, Length, IsInt, Min } from "class-validator";

export class CreateHolidayDto {
  @IsDateString()
  startDate: string;

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
  totalDays: number;
}