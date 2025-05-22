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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  created_by: number;


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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
}
