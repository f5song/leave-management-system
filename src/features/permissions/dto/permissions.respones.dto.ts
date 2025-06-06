import { RoleEntity } from "@src/database/entity/roles.entity";

export class PermissionResponseDto {
  id: string;
  name: string;
  roles: RoleEntity[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
