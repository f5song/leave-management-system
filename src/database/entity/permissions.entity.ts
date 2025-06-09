import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { RoleEntity } from './roles.entity';
import { EPermission } from '@src/common/constants/permission.enum';


@Entity('permission')
export class PermissionEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: EPermission;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'created_by' })
  createdById: string;

  @ManyToOne(() => UserEntity, (user) => user.createdPermissions)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
