import { EFacilityStatus } from "@common/constants/facility-status.enum";

export class UpdateFacilityRequestDto {
  title?: string;
  description?: string;
  status?: EFacilityStatus;
  approvedById?: string;
  approvedAt?: Date;
}
    