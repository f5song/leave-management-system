import { SetMetadata } from '@nestjs/common';
import { IRolePermission } from '../interfaces/role-permission.interface';

export const RolesPermission = (rolePermission: IRolePermission) =>
  SetMetadata('roles-permission', rolePermission);
