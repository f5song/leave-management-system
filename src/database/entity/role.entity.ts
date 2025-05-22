import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserInfoEntity } from './user-info.entity';
import { PermissionEntity } from './permission.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  created_by: number;

  @OneToMany(() => UserInfoEntity, (user) => user.role)
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
}