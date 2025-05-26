export class LeaveTypeResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updateTime: Date;
  deleteTime: Date | null;
}
