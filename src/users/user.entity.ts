import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { DepartmentId } from '../constants/department.enum';
import { JobTitleId } from '../constants/jobtitle.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeCode: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column()
  roleId: string;

  @Column({ type: 'enum', enum: JobTitleId, nullable: true })
  jobTitleId?: JobTitleId;

  @Column({ type: 'enum', enum: DepartmentId, nullable: true })
  departmentId?: DepartmentId;

  @Column({ type: 'date' })
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  googleId?: string;

  @Column({ type: 'decimal', nullable: true })
  salary?: number;

  @Column({ type: 'simple-array', nullable: true })
  approvedUsers?: string[];
}
