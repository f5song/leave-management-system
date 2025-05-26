import { LeaveEntity } from "../database/entity/leave.entity";

export class LeaveResponseDto {
    id: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    reason: string;
    status: string;
    userId: string;
    leaveTypeId: string;
  
    constructor(leave: LeaveEntity) {
      this.id = leave.id;
      this.startDate = leave.startDate;
      this.endDate = leave.endDate;
      this.totalDays = leave.totalDays;
      this.reason = leave.reason;
      this.status = leave.status;
      this.userId = leave.userId;
      this.leaveTypeId = leave.leaveTypeId;
    }
  }
  