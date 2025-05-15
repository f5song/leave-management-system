export class CreateJobTitleDto {
    id: string;
    name: string;
    department_id?: string;
  }

  export class UpdateJobTitleDto {
    name?: string;
    department_id?: string;
  }
  