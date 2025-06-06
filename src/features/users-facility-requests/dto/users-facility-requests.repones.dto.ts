import { EFacilityStatus } from "@common/constants/facility-status.enum";

export class FacilityRequestResponseDto {
  id: string;
  title: string;
  description?: string;
  requestedById: string;
  status: EFacilityStatus;
  approvedById?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}