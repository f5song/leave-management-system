import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { AccountEntity } from './account.entity';
import { RoleEntity } from './role.entity';
import { JobTitleEntity } from './job-title.entity';
import { DepartmentEntity } from './department.entity';
import { LeaveEntity } from './leave.entity';
import { PermissionEntity } from './permission.entity';
import { HolidayEntity } from './holiday.entity';
import { ItemRequestEntity } from './item-request.entity';
import { FacilityRequestEntity } from './facility-request.entity';

@Entity('userinfo')
export class UserInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'nick_name' })
  nickName?: string;


  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'job_title_id' })
  jobTitleId: string;

  @Column({ name: 'department_id' })
  departmentId: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => JobTitleEntity, (jt) => jt.id)
  @JoinColumn({ name: 'job_title_id' })
  jobTitle: JobTitleEntity;

  @ManyToOne(() => DepartmentEntity, (dept) => dept.id)
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

  // @OneToMany(() => AccountEntity, (account) => account.user)
  // accounts: AccountEntity[];

  @OneToMany(() => AccountEntity, (account) => account.approvedBy)
  approvedAccounts: AccountEntity[];

  @OneToMany(() => HolidayEntity, (holiday) => holiday.createdBy)
  createdHolidays: HolidayEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime?: Date;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime?: Date;

    // ✅ ความสัมพันธ์กับการขอเบิกของ
    @OneToMany(() => ItemRequestEntity, request => request.requester)
    itemRequests: ItemRequestEntity[];
  
    // ✅ ความสัมพันธ์กับการอนุมัติการเบิกของ
    @OneToMany(() => ItemRequestEntity, request => request.approver)
    itemApprovals: ItemRequestEntity[];
  
    // ✅ ความสัมพันธ์กับการร้องขอ facilities
    @OneToMany(() => FacilityRequestEntity, facility => facility.requester)
    facilityRequests: FacilityRequestEntity[];
  
    // ✅ ความสัมพันธ์กับการอนุมัติ facilities
    @OneToMany(() => FacilityRequestEntity, facility => facility.approver)
    facilityApprovals: FacilityRequestEntity[];
}
