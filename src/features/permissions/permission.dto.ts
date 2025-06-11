import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional, IsDate, IsUUID } from 'class-validator';
import { RoleEntity } from '../../database/entity/roles.entity';


export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    roleId: number;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    createdById: string;
}

export class PermissionResponseDto {
  id: string;
  name: string;
  roles: RoleEntity[];
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
