import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { PermissionRoleEntity } from './permission-role';
import { ERole } from '@common/constants/roles.enum';

@Entity('roles')
export class RoleEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: ERole;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'created_by' })
  createdById: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  user: UserEntity[];

  @OneToMany(() => PermissionRoleEntity, (pr) => pr.role)
  permissionRoles: PermissionRoleEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdRoles)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
