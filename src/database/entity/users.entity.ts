import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, DeleteDateColumn, BeforeInsert, Repository, AfterInsert } from 'typeorm';
import { AccountEntity } from './account.entity';
import { RoleEntity } from './roles.entity';
import { JobTitleEntity } from './job-titles.entity';
import { DepartmentEntity } from './departments.entity';
import { LeaveEntity } from './leaves.entity';
import { PermissionEntity } from './permissions.entity';
import { HolidayEntity } from './holidays.entity';
import { ItemRequestEntity } from './users-items-request.entity';
import { FacilityRequestEntity } from './users-facility-requests.entity';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { DepartmentId } from 'src/constants/department.enum';
@Entity('users')
export class UserInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_code', unique: true })
  employeeCode: string;

  @Column({ unique: true, name: 'googleId' })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'nick_name' })
  nickName?: string;

  @Column({ type: 'datetime', nullable: true, name: 'approvedAt' })
  approvedAt?: Date;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'job_title_id', type: 'enum', enum: JobTitleId })
  jobTitleId: JobTitleId;

  @Column({ name: 'department_id', type: 'enum', enum: DepartmentId })
  departmentId: DepartmentId;

  @ManyToOne(() => JobTitleEntity, (jobTitle) => jobTitle.users)
  @JoinColumn({ name: 'job_title_id' })
  jobTitle: JobTitleEntity;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column()
  salary: number;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

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

  @OneToMany(() => ItemRequestEntity, request => request.requester)
  itemRequests: ItemRequestEntity[];

  @OneToMany(() => ItemRequestEntity, request => request.approver)
  itemApprovals: ItemRequestEntity[];

  @OneToMany(() => FacilityRequestEntity, facility => facility.requester)
  facilityRequests: FacilityRequestEntity[];

  @OneToMany(() => FacilityRequestEntity, facility => facility.approver)
  facilityApprovals: FacilityRequestEntity[];

  @BeforeInsert()
  async generateEmployeeCode(userRepository: Repository<UserInfoEntity>) {
    if (!this.employeeCode) {

      const lastUser = await userRepository
        .createQueryBuilder('userinfo')
        .orderBy('userinfo.createdAt', 'DESC')
        .getOne();
      console.log('🔍 Last user:', lastUser);

      let newCode: string;

      if (lastUser?.employeeCode) {
        const lastNumber = parseInt(lastUser.employeeCode.replace('fh-', ''), 10);
        const nextNumber = lastNumber + 1;

        newCode = `fh-${nextNumber.toString().padStart(4, '0')}`;
      } else {
        newCode = 'fh-0001';
      }

      this.employeeCode = newCode;

      // let nextNumber = 1;
      // if (lastUser?.employeeCode) {
      //   const lastCode = lastUser.employeeCode.replace(prefix, '');
      //   const parsed = parseInt(lastCode, 10);
      //   if (!isNaN(parsed)) {
      //     nextNumber = parsed + 1;
      //   }
      // }

      // const code = String(nextNumber).padStart(3, '0');
      // this.employeeCode = `${prefix}${code}`;
    }
  }

  // @AfterInsert()
  // logAfterInsert() {
  //   console.log('Created user successfully:', this.email, 'with employee code:', this.employeeCode);
  // }
}
