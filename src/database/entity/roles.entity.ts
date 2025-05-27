import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from './users.entity';
import { PermissionEntity } from './permissions.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true , name: 'created_by'})
  createdById: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  @JoinColumn({ name: 'role_id' })
  user: UserEntity[];

  @ManyToMany(() => PermissionEntity, (rp) => rp.roles)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
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