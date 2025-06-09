import { DepartmentEntity } from "../entity/departments.entity";
import { EDepartmentId } from "@common/constants/department.enum";

export const departmentsSeedData: Partial<DepartmentEntity>[] = [
    {
      id: EDepartmentId.HR,
      name: 'Human Resources',
      color: '#FF5733',
    },
    {
      id: EDepartmentId.IT,
      name: 'Information Technology',
      color: '#3355FF',
    },
  ];

