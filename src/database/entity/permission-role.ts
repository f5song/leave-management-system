import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { ERole } from "@common/constants/roles.enum";
import { EPermission } from "@src/common/constants/permission.enum";
import { RoleEntity } from "./roles.entity";
import { PermissionEntity } from "./permissions.entity";

@Entity('permission_role')
export class PermissionRoleEntity {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    role_id: ERole;

    @PrimaryColumn({ type: 'varchar', length: 50 })
    permission_id: EPermission;

    @ManyToOne(() => RoleEntity, (role) => role.permissionRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @ManyToOne(() => PermissionEntity, (permission) => permission.permissionRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: PermissionEntity;
}
