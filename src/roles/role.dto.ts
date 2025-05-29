import { IsOptional, IsString, IsInt, IsUUID, IsDate } from 'class-validator';
import { UserEntity } from 'src/database/entity/users.entity';
import { PermissionEntity } from 'src/database/entity/permissions.entity';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

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
