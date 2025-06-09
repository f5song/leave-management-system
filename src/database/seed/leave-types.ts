import { ELeaveType } from '@common/constants/leave-type.enum';
import { LeaveTypeEntity } from '../entity/leave-types.entity';

export const leaveTypesSeedData: Partial<LeaveTypeEntity>[] = [
  {
    id: ELeaveType.ANNUAL,
    name: 'Annual Leave',
    description: 'Leave for annual vacation or personal time off',
    deletedAt: null,
  },
  {
    id: ELeaveType.SICK,
    name: 'Sick Leave',
    description: 'Leave for sickness or medical reasons',
    deletedAt: null,
  },
  {
    id: ELeaveType.MATERNITY,
    name: 'Maternity Leave',
    description: 'Leave for maternity purposes',
    deletedAt: null,
  },
  {
    id: ELeaveType.PATERNITY,
    name: 'Paternity Leave',
    description: 'Leave for paternity purposes',
    deletedAt: null,
  }
];
