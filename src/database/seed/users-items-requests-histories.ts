import { EStatus } from '@common/constants/status.enum';
import { UsersItemsRequestsHistoryEntity } from '../entity/users-items-requests-histories.entity';

export const usersItemsRequestsHistorySeedData: Partial<UsersItemsRequestsHistoryEntity>[] = [
  {
    id: 'uuid-history-1',
    request: null,
    actionById: 'uuid-admin-1',
    actionType: EStatus.PENDING,
    actionAt: new Date('2025-06-01T08:30:00Z'),
    // borrow_start_date: new Date('2025-06-10T09:00:00Z'),
    // borrow_end_date: new Date('2025-06-15T18:00:00Z'),
  },
  {
    id: 'uuid-history-2',
    request: null,
    actionById: 'uuid-admin-1',
    actionType: EStatus.APPROVED,
    actionAt: new Date('2025-06-02T10:00:00Z'),
    // borrow_start_date: new Date('2025-06-10T09:00:00Z'),
    // borrow_end_date: new Date('2025-06-15T18:00:00Z'),
  },
];
