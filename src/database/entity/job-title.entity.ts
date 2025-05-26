import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DepartmentEntity } from './department.entity';
import { UserInfoEntity } from './user-info.entity';

@Entity('job_titles')
export class JobTitleEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'department_id' })
  departmentId: string;

  @ManyToOne(() => DepartmentEntity, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @Column({ type: 'timestamp', nullable: true , name: 'delete_time'})
  deleteTime: Date | null;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  @OneToMany(() => UserInfoEntity, (user) => user.jobTitle)
  users: UserInfoEntity[];
}
