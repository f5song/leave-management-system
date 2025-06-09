import { EDepartmentId } from "@src/common/constants/department.enum";
import { JobTitleEntity } from "@src/database/entity/job-titles.entity";
import { UserEntity } from "@src/database/entity/users.entity";

export class DepartmentResponseDto {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  users: UserEntity[];
  jobTitles: JobTitleEntity[];
}