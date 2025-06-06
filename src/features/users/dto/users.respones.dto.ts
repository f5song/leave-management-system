import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { EDepartmentId } from "@common/constants/department.enum";

export class UserResponseDto {
  id: string;
  employeeCode: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  avatarUrl?: string;
  birthDate: Date;
  salary: number;
  roleId: string;
  jobTitleId: EJobTitleId;
  departmentId: EDepartmentId;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
