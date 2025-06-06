import { UserEntity } from "@src/database/entity/users.entity";
import { PermissionEntity } from "@src/database/entity/permissions.entity";

export class RoleResponseDto {
  id: string;

  name: string;

  createdById: string;

  createdBy?: UserEntity;

  user?: UserEntity[];

  permissions?: PermissionEntity[];

  createdAt: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
