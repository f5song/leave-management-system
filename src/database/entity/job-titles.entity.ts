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
import { DepartmentEntity } from './departments.entity';
import { UserInfoEntity } from './users.entity';
import { JobTitleId } from '../../constants/jobtitle.enum';
import { DepartmentId } from 'src/constants/department.enum';

@Entity('job_titles')
export class JobTitleEntity {

  @PrimaryColumn({ type: 'enum', enum: JobTitleId })
  id: JobTitleId;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: DepartmentId })
  departmentId: DepartmentId;

  @ManyToOne(() => DepartmentEntity, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @Column({ type: 'timestamp', nullable: true, name: 'delete_time' })
  deleteTime: Date | null;

  @CreateDateColumn({ name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  @OneToMany(() => UserInfoEntity, (user) => user.jobTitle)
  users: UserInfoEntity[];
}
