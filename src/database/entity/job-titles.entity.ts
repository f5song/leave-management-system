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
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { EDepartmentId } from '@common/constants/department.enum';
import { UserEntity } from './users.entity';

@Entity('job_titles')
export class JobTitleEntity {

  @PrimaryColumn({ type: 'enum', enum: EJobTitleId })
  id: EJobTitleId;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @Column({ type: 'enum', enum: EDepartmentId })
  departmentId: EDepartmentId;

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
