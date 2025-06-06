export class JobTitleResponseDto {
  id: string;
  name: string;
  color: string;
  departmentId: string;
  departmentName: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
