import { Exclude, Expose } from 'class-transformer';
import { IsDateString, IsOptional, IsString, Length, IsInt, Min } from 'class-validator';
import { HolidayEntity } from 'src/database/entity/holidays.entity';

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

export class UpdateHolidayDto {
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
  totalDays: number;
}

export class HolidayResponseDto {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  totalDays: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
