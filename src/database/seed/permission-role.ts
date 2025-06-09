import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';

export const permissionRoleSeedData = [
  {
    role_id: ERole.ADMIN,
    permission_id: EPermission.CREATE_USER,
  },
  {
    role_id: ERole.ADMIN,
    permission_id: EPermission.DELETE_USER,
  },
  {
    role_id: ERole.ADMIN,
    permission_id: EPermission.UPDATE_USER,
  },
  {
    role_id: ERole.ADMIN,
    permission_id: EPermission.READ_USER,
  },
];
