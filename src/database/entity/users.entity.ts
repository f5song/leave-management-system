import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  Repository
} from 'typeorm';
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
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_code', unique: true })
  employeeCode: string;

  @Column({ unique: true, name: 'google_id' })
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'nick_name' })
  nickName?: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'birth_date' })
  birthDate: Date;

  @Column()
  salary: number;

  @Column({ name: 'role_id' })
  roleId: string;
  @Column({ name: 'job_title_id', type: 'enum', enum: JobTitleId })
  jobTitleId: JobTitleId;

  @Column({ name: 'department_id', type: 'enum', enum: DepartmentId })
  departmentId: DepartmentId;

  // ✅ Self-referencing: คนที่อนุมัติ user คนนี้
  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'approved_by' })
  approvedByUser?: UserEntity;

  // ✅ Inverse: user คนนี้เคยอนุมัติใครบ้าง
  @OneToMany(() => UserEntity, user => user.approvedByUser)
  approvedUsers: UserEntity[];

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @ManyToOne(() => RoleEntity, role => role.user)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => JobTitleEntity, job => job.users)
  @JoinColumn({ name: 'job_title_id' })
  jobTitle: JobTitleEntity;

  @ManyToOne(() => DepartmentEntity, dept => dept.id)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @OneToMany(() => PermissionEntity, perm => perm.createdBy)
  createdPermissions: PermissionEntity[];

  @OneToMany(() => LeaveEntity, leave => leave.userInfo)
  leaves: LeaveEntity[];

  @OneToMany(() => LeaveEntity, leave => leave.createdBy)
  createdLeaves: LeaveEntity[];

  @OneToMany(() => RoleEntity, role => role.createdBy)
  createdRoles: RoleEntity[];

  @OneToMany(() => HolidayEntity, holiday => holiday.createdBy)
  createdHolidays: HolidayEntity[];

  @OneToMany(() => ItemRequestEntity, request => request.requestedBy)
  itemRequests: ItemRequestEntity[];

  @OneToMany(() => ItemRequestEntity, request => request.approvedBy)
  itemApprovals: ItemRequestEntity[];

  @OneToMany(() => FacilityRequestEntity, request => request.requestedBy)
  facilityRequests: FacilityRequestEntity[];

  @OneToMany(() => FacilityRequestEntity, request => request.approvedBy)
  facilityApprovals: FacilityRequestEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  async generateEmployeeCode(userRepository: Repository<UserEntity>) {
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
    }
  }
}
