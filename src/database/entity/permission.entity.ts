import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';
import { RoleEntity } from './role.entity';

@Entity('permission') 
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true , name: 'created_by'})
  createdById: number;


  @ManyToOne(() => UserInfoEntity, (user) => user.createdPermissions)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserInfoEntity;


  @ManyToMany(() => RoleEntity, (rp) => rp.permissions)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'permission_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime?: Date;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime?: Date;
}
