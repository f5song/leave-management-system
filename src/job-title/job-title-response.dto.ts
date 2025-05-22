import { JobTitleEntity } from '../database/entity/job-title.entity';

export class JobTitleResponseDto {
  id: string;
  name: string;
  department_id: string;
  department_name: string | null;

  constructor(jobTitle: JobTitleEntity) {
    this.id = jobTitle.id;
    this.name = jobTitle.name;
    this.department_id = jobTitle.department_id;
    this.department_name = jobTitle.department ? jobTitle.department.name : null;
  }
}
