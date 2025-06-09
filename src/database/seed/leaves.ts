import { ELeaveStatus } from '@common/constants/leave-status.enum';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { LeaveEntity } from '../entity/leaves.entity';

export const leavesSeedData: Partial<LeaveEntity>[] = [
  {
    userId: 'uuid-user-1',
    title: 'Annual Leave for vacation',
    description: 'Taking a few days off for personal vacation.',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-06-05'),
    totalDays: 5,
    leaveTypeId: ELeaveType.ANNUAL,
    status: ELeaveStatus.APPROVED,
    actionBy: 'uuid-admin-1',
    createdById: 'uuid-user-1',
    actionAt: new Date('2025-05-25'),
    createdAt: new Date('2025-05-20'),
  },
  {
    userId: 'uuid-user-2',
    title: 'Sick Leave',
    description: 'Feeling unwell and need to rest.',
    startDate: new Date('2025-06-10'),
    endDate: new Date('2025-06-12'),
    totalDays: 3,
    leaveTypeId: ELeaveType.SICK,
    status: ELeaveStatus.PENDING,
    createdById: 'uuid-user-2',
    createdAt: new Date('2025-06-09'),
  },
];
