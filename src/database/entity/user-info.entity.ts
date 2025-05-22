import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { RoleEntity } from './role.entity';
import { JobTitleEntity } from './job-title.entity';
import { DepartmentEntity } from './department.entity';
import { LeaveEntity } from './leave.entity';
import { PermissionEntity } from './permission.entity';
import { HolidayEntity } from './holiday.entity';

@Entity('userinfo')
export class UserInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  nick_name?: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  role_id: number;

  @Column({ nullable: true })
  job_title_id: string;

  @Column({ nullable: true })
  department_id: string;

  @Column({ nullable: true })
  birth_date: Date;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => JobTitleEntity, (jt) => jt.users)
  @JoinColumn({ name: 'job_title_id' })
  jobTitle: JobTitleEntity;

  @ManyToOne(() => DepartmentEntity, (dept) => dept.users)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @OneToMany(() => PermissionEntity, (perm) => perm.createdBy)
  createdPermissions: PermissionEntity[];

  @OneToMany(() => LeaveEntity, (leave) => leave.userInfo)
  leaves: LeaveEntity[];

  @OneToMany(() => LeaveEntity, (leave) => leave.createdBy)
  createdLeaves: LeaveEntity[];

  @OneToMany(() => RoleEntity, (role) => role.createdBy)
  createdRoles: RoleEntity[];

  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @OneToMany(() => AccountEntity, (account) => account.approvedBy)
  approvedAccounts: AccountEntity[];

  @OneToMany(() => HolidayEntity, (holiday) => holiday.createdBy)
  createdHolidays: HolidayEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
}
