import { IsEnum, IsOptional, IsString, IsDate } from "class-validator";
import { EItemRequestHistoryStatus } from "@common/constants/item-request-history-status.enum";

export class UpdateItemsRequestsHistoryDto {

  @IsEnum(EItemRequestHistoryStatus)
  @IsOptional()
  status?: EItemRequestHistoryStatus;
  
  @IsString()
  @IsOptional()
  reason?: string;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}   