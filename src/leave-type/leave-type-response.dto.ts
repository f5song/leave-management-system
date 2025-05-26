import { LeaveType } from "src/constants/leave-type.enum";

export class LeaveTypeResponseDto {
  id: LeaveType;
  name: string;
  description?: string;
  createdAt: Date;
  updateTime: Date;
  deleteTime: Date | null;
}
