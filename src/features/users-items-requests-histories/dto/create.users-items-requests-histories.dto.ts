import { IsUUID, IsEnum, IsString, IsOptional, IsDate } from "class-validator";
import { EItemRequestStatus } from "@common/constants/item-request-status.enum";

export class CreateItemsRequestsHistoryDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  requestId?: string;

  @IsEnum(EItemRequestStatus)
  status: EItemRequestStatus;
  
  @IsDate()
  @IsOptional()
  createdAt?: Date;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}