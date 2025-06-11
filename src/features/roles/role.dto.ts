import { IsOptional, IsString, IsInt, IsUUID, IsDate } from 'class-validator';
import { UserEntity } from '../../database/entity/users.entity';
import { PermissionEntity } from '../../database/entity/permissions.entity';


export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

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
