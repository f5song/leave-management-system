import { EItemStatus } from '@common/constants/item-status.enum';
import { UsersItemEntity } from '../entity/users-items.entity';

export const usersItemsSeedData: Partial<UsersItemEntity>[] = [
  {
    id: 'uuid-item-1',
    name: 'เมาส์ไร้สาย Logitech',
    description: 'เมาส์ไร้สายขนาดเล็ก สำหรับใช้งานทั่วไป',
    quantity: 10,
    status: EItemStatus.AVAILABLE,
    createdById: 'uuid-admin-1',
    createdAt: new Date('2025-01-01T09:00:00Z'),
    updatedAt: new Date('2025-05-01T10:00:00Z'),
    deletedAt: null,
  },
  {
    id: 'uuid-item-2',
    name: 'คีย์บอร์ด Mechanical',
    description: 'คีย์บอร์ดแบบ Mechanical สีดำพร้อมไฟ RGB',
    quantity: 5,
    status: EItemStatus.AVAILABLE,
    createdById: 'uuid-admin-1',
    createdAt: new Date('2025-02-15T11:30:00Z'),
    updatedAt: null,
    deletedAt: null,
  },
  {
    id: 'uuid-item-3',
    name: 'จอมอนิเตอร์ 24 นิ้ว',
    description: 'จอมอนิเตอร์ IPS 24 นิ้ว ความละเอียด Full HD',
    quantity: 3,
    status: EItemStatus.UNAVAILABLE,
    createdById: 'uuid-admin-1',
    createdAt: new Date('2025-03-20T08:00:00Z'),
    updatedAt: new Date('2025-05-20T15:00:00Z'),
    deletedAt: null,
  },
];
