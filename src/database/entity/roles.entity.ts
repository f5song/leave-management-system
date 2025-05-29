import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';
import { PermissionEntity } from './permissions.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, name: 'created_by' })
  createdById: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  user: UserEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: 'permission_role', // ชื่อตารางกลาง
    joinColumn: { name: 'role_id' }, // ชื่อคอลัมน์ฝั่ง Role
    inverseJoinColumn: { name: 'permission_id' }, // ฝั่ง Permission
  })
  permissions: PermissionEntity[];

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
