export class HolidayResponseDto {
  id: number;
  title: string;
  start_date: Date;
  end_date?: Date;
  description?: string;
  total_days?: number;
  created_at: Date;
  update_time: Date;
  delete_time: Date;
  color: string;
}
