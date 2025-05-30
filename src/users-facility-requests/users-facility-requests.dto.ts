import { FacilityStatus } from '../constants/facility-status.enum';

export class CreateFacilityRequestDto {
  title: string;
  description?: string;
  requestedById: string;
}

export class UpdateFacilityRequestDto {
  title?: string;
  description?: string;
  status?: FacilityStatus;
  approvedById?: string;
  approvedAt?: Date;
}

export class FacilityRequestResponseDto {
  id: string;
  title: string;
  description?: string;
  requestedById: string;
  status: FacilityStatus;
  approvedById?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  static fromEntity(entity: any): FacilityRequestResponseDto {
    const dto = new FacilityRequestResponseDto();
    Object.assign(dto, entity);
    return dto;
  }
}
