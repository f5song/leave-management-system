import { ERole } from '@common/constants/roles.enum';
import { RoleEntity } from '../entity/roles.entity';

export const rolesSeedData: Partial<RoleEntity>[] = [
  {
    id: ERole.ADMIN,
    name: 'admin',
    createdAt: new Date('2025-01-01T09:00:00Z'),
  },
  {
    id: ERole.EMPLOYEE,
    name: 'employee',
    createdAt: new Date('2025-01-01T09:05:00Z'),
  }
];
