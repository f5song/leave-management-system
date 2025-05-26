export class HolidayResponseDto {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  totalDays?: number;
  createdAt: Date;
  updateTime: Date;
  deleteTime: Date;
  color: string;
}
