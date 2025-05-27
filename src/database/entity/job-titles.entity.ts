import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DepartmentEntity } from './departments.entity';
import { JobTitleId } from '../../constants/jobtitle.enum';
import { DepartmentId } from 'src/constants/department.enum';
import { UserEntity } from './users.entity';

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

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => UserEntity, (user) => user.jobTitle)
  users: UserEntity[];
}
