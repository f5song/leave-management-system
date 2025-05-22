import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { Role } from '../role/role.entity';
import { JobTitle } from '../job-title/job-title.entity';
import { Department } from '../department/department.entity';
import { Leave } from '../leave/leave.entity';

@Entity('userinfo')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  nick_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  role_id: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ nullable: true })
  job_title_id: string;

  @ManyToOne(() => JobTitle, jobTitle => jobTitle.users)
  @JoinColumn({ name: 'job_title_id' })
  jobTitle: JobTitle;

  @Column({ nullable: true })
  department_id: string;

  @ManyToOne(() => Department, department => department.users)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ nullable: true })
  birth_date: Date;

  @OneToOne(() => AccountEntity, account => account.user)
  @JoinColumn()
  account: AccountEntity;

  @OneToMany(() => Leave, leave => leave.user)
  leaves: Leave[];

  @OneToMany(() => Leave, leave => leave.approver)
  approvedLeaves: Leave[];

  @OneToMany(() => Leave, leave => leave.creator)
  createdLeaves: Leave[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;
  createdHolidays: any;
}
