import { EFacilityStatus } from '@common/constants/facility-status.enum';
import { UsersFacilityRequestEntity } from '../entity/users-facility-requests.entity';

export const usersFacilityRequestsSeedData: Partial<UsersFacilityRequestEntity>[] = [
  {
    id: 'uuid-facility-request-1',
    title: 'ขอเมาส์ไร้สาย',
    description: 'เมาส์ไร้สายสำหรับงานประจำวัน',
    requestedById: 'uuid-user-1',
    status: EFacilityStatus.PENDING,
    createdAt: new Date('2025-06-01T08:00:00Z'),
  },
  {
    id: 'uuid-facility-request-2',
    title: 'ขอจอภาพเพิ่ม',
    description: 'ต้องการจอภาพ 24 นิ้ว เพื่อเพิ่มประสิทธิภาพการทำงาน',
    requestedById: 'uuid-user-2',
    status: EFacilityStatus.APPROVED,
    approvedById: 'uuid-admin-1',
    approvedAt: new Date('2025-06-02T10:00:00Z'),
    createdAt: new Date('2025-06-01T09:00:00Z'),
  },
];
