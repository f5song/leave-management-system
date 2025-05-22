import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { AccountEntity } from './account.entity';
import { UserInfoEntity } from './user-info.entity';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => UserInfoEntity, user => user.department)
  users: UserInfoEntity[];

  @Column()
  jobTitles: any;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;

  @DeleteDateColumn()
  delete_time: Date | null;
}
