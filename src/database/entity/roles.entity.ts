import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserInfoEntity } from './users.entity';
import { PermissionEntity } from './permissions.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true , name: 'created_by'})
  createdById: number;

  @OneToMany(() => UserInfoEntity, (user) => user.role)
  @JoinColumn({ name: 'role_id' })
  user: UserInfoEntity[];

  @ManyToMany(() => PermissionEntity, (rp) => rp.roles)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];

  @ManyToOne(() => UserInfoEntity, (user) => user.createdRoles)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserInfoEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime?: Date;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime?: Date;
}