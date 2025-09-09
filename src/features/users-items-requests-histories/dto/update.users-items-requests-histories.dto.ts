import { IsOptional, IsDate, IsDateString } from "class-validator";

export class UpdateItemsRequestsHistoryDto {

  @IsDateString() 
  @IsOptional()
  borrow_start_date?: Date;

  @IsDateString() 
  @IsOptional()
  borrow_end_date?: Date;
}   