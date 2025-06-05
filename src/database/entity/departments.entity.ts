import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { DepartmentId } from '../../constants/department.enum';
import { UserEntity } from './users.entity';
import { JobTitleEntity } from './job-titles.entity';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryColumn({ type: 'enum', enum: DepartmentId })
  id: DepartmentId;

  @Column({ unique: true })
  name: string;

  @Column({ default: '#000000' })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => UserEntity, user => user.department)
  users: UserEntity[];

  @OneToMany(() => JobTitleEntity, jobTitle => jobTitle.department)
  jobTitles: JobTitleEntity[];



}
