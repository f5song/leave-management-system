import { LeaveEntity } from "../database/entity/leave.entity";

export class LeaveResponseDto {
    id: number;
    start_date: Date;
    end_date: Date;
    total_days: number;
    reason: string;
    status: string;
    userId: number;
    leaveTypeId:  string // ← แก้ตรงนี้จาก string เป็น number
  
    constructor(leave: LeaveEntity) {
      this.id = leave.id;
      this.start_date = leave.start_date;
      this.end_date = leave.end_date;
      this.total_days = leave.total_days;
      this.reason = leave.reason;
      this.status = leave.status;
      this.userId = leave.user?.id;
      this.leaveTypeId = leave.leaveType?.id;
    }
  }
  