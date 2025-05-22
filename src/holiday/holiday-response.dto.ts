export class HolidayResponseDto {
  id: number;
  start_date: Date;
  end_date?: Date;
  description?: string;
  total_days?: number;
  created_at: Date;
  updated_at: Date;
}
