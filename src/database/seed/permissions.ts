import { EPermission } from '@src/common/constants/permission.enum';
import { PermissionEntity } from '../entity/permissions.entity';

export const permissionsSeedData: Partial<PermissionEntity>[] = [
  {
    id: EPermission.CREATE_USER,
    name: 'Create User',
    createdAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: EPermission.DELETE_USER,
    name: 'Delete User',
    createdAt: new Date('2025-01-01T10:05:00Z'),
  },
  {
    id: EPermission.UPDATE_USER,
    name: 'Update User',
    createdAt: new Date('2025-01-01T10:10:00Z'),
  },
  {
    id: EPermission.READ_USER,
    name: 'View User',
    createdAt: new Date('2025-01-01T10:15:00Z'),
  },
];
