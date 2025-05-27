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
import { UserEntity } from './users.entity';
import { RoleEntity } from './roles.entity';

@Entity('permission') 
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true , name: 'created_by'})
  createdById: string;


  @ManyToOne(() => UserEntity, (user) => user.createdPermissions)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;


  @ManyToMany(() => RoleEntity, (rp) => rp.permissions)
  @JoinTable({
    name: 'permission_role',
    joinColumn: { name: 'permission_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
