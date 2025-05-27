import { JobTitleEntity } from '../database/entity/job-titles.entity';

export class JobTitleResponseDto {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string | null;

  constructor(jobTitle: JobTitleEntity) {
    this.id = jobTitle.id;
    this.name = jobTitle.name;
    this.departmentId = jobTitle.departmentId;
    this.departmentName = jobTitle.department ? jobTitle.department.name : null;
  }
}
