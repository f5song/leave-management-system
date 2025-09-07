import { ELeaveType } from "@src/common/constants/leave-type.enum";

export class LeaveResponseDto {
  id: string;
  userId?: string;
  leaveTypeId: ELeaveType;
  title: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  status: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}