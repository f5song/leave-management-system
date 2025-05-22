export class LeaveTypeResponseDto {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  update_time: Date;
  delete_time: Date | null;
}
