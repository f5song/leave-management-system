export class LeaveTypeResponseDto {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  update_time: Date;
  delete_time: Date | null;
}
