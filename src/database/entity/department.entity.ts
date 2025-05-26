import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { AccountEntity } from './account.entity';
import { UserInfoEntity } from './user-info.entity';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_time' })
  updateTime: Date;

  @DeleteDateColumn({ name: 'delete_time' })
  deleteTime: Date | null;
  
  // @OneToMany(() => UserInfoEntity, user => user.department)
  // users: UserInfoEntity[];
}
