import { IsEnum, IsOptional, IsString, IsDate, IsDateString } from "class-validator";
import { EItemRequestStatus } from "@common/constants/item-request-status.enum";

export class UpdateItemsRequestsHistoryDto {

  @IsDateString() 
  @IsOptional()
  borrow_start_date?: Date;

  @IsDateString() 
  @IsOptional()
  borrow_end_date?: Date;
}   