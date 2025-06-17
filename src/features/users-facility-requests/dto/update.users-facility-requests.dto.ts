import { EFacilityStatus } from "@common/constants/facility-status.enum";
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum, ValidateIf } from "class-validator";

export class UpdateFacilityRequestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(EFacilityStatus)
  status?: EFacilityStatus;

  @ValidateIf(o => o.status === EFacilityStatus.APPROVED)
  @IsOptional()
  @IsUUID()
  approveById?: string;

  // @IsEnum(EFacilityStatus)
  // @IsOptional()
  // status?: EFacilityStatus;

  // @IsUUID()
  // @IsOptional()
  // approvedById?: string;

  // @IsOptional()
  // approvedAt?: Date;
}
    