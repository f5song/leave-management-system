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


  @OneToMany(() => RoleEntity, (rp) => rp.permissions)
  roles: RoleEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
}
