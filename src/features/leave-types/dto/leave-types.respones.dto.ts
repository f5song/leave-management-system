import { LeaveEntity } from "@src/database/entity/leaves.entity";
import { ELeaveType } from "@common/constants/leave-type.enum";

export class LeaveTypeResponseDto {
  id: ELeaveType;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  leaves: LeaveEntity[];
}