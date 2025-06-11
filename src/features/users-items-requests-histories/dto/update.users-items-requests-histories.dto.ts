import { IsEnum, IsOptional, IsString, IsDate } from "class-validator";
import { EItemRequestStatus } from "@common/constants/item-request-status.enum";

export class UpdateItemsRequestsHistoryDto {

  @IsEnum(EItemRequestStatus)
  @IsOptional()
  status?: EItemRequestStatus;
  
  @IsString()
  @IsOptional()
  reason?: string;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}   