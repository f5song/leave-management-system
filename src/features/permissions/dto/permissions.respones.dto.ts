import { PermissionRoleEntity } from "@src/database/entity/permission-role";

export class PermissionResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  permissionRoles: PermissionRoleEntity[];
}
