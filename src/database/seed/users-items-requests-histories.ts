import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { UsersItemsRequestsHistoryEntity } from '../entity/users-items-requests-histories.entity';

export const usersItemsRequestsHistorySeedData: Partial<UsersItemsRequestsHistoryEntity>[] = [
  {
    id: 'uuid-history-1',
    requestId: 'uuid-request-1',
    actionBy: 'uuid-admin-1',
    actionType: EItemRequestStatus.PENDING,
    actionAt: new Date('2025-06-01T08:30:00Z'),
    borrow_start_date: new Date('2025-06-10T09:00:00Z'),
    borrow_end_date: new Date('2025-06-15T18:00:00Z'),
  },
  {
    id: 'uuid-history-2',
    requestId: 'uuid-request-1',
    actionBy: 'uuid-admin-1',
    actionType: EItemRequestStatus.APPROVED,
    actionAt: new Date('2025-06-02T10:00:00Z'),
    borrow_start_date: new Date('2025-06-10T09:00:00Z'),
    borrow_end_date: new Date('2025-06-15T18:00:00Z'),
  },
];
