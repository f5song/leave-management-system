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

@Exclude()
export class HolidayResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  description?: string;

  @Expose()
  totalDays: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;

  @Expose()
  color: string;

  constructor(holiday: HolidayEntity) {
    Object.assign(this, holiday);
  }
}
