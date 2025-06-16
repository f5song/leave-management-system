import { UserEntity } from "@src/database/entity/users.entity";
import { PermissionEntity } from "@src/database/entity/permissions.entity";
import { PermissionRoleEntity } from "@src/database/entity/permission-role";
import { ERole } from "@src/common/constants/roles.enum";

export class RoleResponseDto {
  id: ERole;

  name: string;

  createdById: string;

  createdBy?: UserEntity;

  user?: UserEntity[];

  permissions?: PermissionEntity[];

  createdAt: Date;

  updatedAt?: Date;

  deletedAt?: Date;

  permissionRoles?: PermissionRoleEntity[];
}
