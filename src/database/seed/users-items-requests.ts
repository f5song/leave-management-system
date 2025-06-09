import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { UsersItemRequestEntity } from '../entity/users-items-requests.entity';

export const usersItemRequestsSeedData: Partial<UsersItemRequestEntity>[] = [
  {
    id: 'uuid-request-1',
    itemId: 'uuid-item-1',
    status: EItemRequestStatus.PENDING,
    quantity: 2,
    actionAt: new Date('2025-06-01T08:30:00Z'),
    createdAt: new Date('2025-06-01T08:30:00Z'),
    requestedById: 'uuid-user-1',
    deletedAt: null,
  },
  {
    id: 'uuid-request-2',
    itemId: 'uuid-item-2',
    status: EItemRequestStatus.APPROVED,
    quantity: 1,
    actionAt: new Date('2025-06-02T10:00:00Z'),
    createdAt: new Date('2025-06-02T10:00:00Z'),
    requestedById: 'uuid-user-2',
    deletedAt: null,
  },
];
