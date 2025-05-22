import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../department/department.entity';

@Entity('job_titles')
export class JobTitle {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ name: 'department_id' })
  department_id: string;

  @ManyToOne(() => Department, (department) => department.jobTitles)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'timestamp', nullable: true })
  delete_time: Date | null;

  @CreateDateColumn({ name: 'create_time' })
  create_time: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  update_time: Date | null;
}
