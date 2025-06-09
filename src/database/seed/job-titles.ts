import { EDepartmentId } from "@common/constants/department.enum";
import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { JobTitleEntity } from "../entity/job-titles.entity";

export const jobTitlesSeedData: Partial<JobTitleEntity>[] = [
    {
      id: EJobTitleId.DEPARTMENT_HEAD,
      name: 'Department Head',
      color: '#FF5733',
      departmentId: EDepartmentId.HR,
      deletedAt: null,
    },
    {
      id: EJobTitleId.STAFF,
      name: 'Staff',
      color: '#33A1FF',
      departmentId: EDepartmentId.IT,
      deletedAt: null,
    },
  ];
  