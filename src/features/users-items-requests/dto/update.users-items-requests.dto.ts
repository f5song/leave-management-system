import { IsUUID, IsOptional, IsNumber, Min, IsEnum, IsDateString } from "class-validator";
import { EItemRequestStatus } from "@common/constants/item-request-status.enum";

export class UpdateItemRequestDto {

  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  itemId?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsEnum(EItemRequestStatus)
  @IsOptional()
  status?: EItemRequestStatus;

  @IsUUID()
  @IsOptional()
  approveById?: string;

  @IsOptional()
  action_at?: Date;

  @IsOptional()
  deleted_at?: Date;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  requested_by?: string;

  @IsDateString()
  @IsOptional()
  borrow_start_date?: Date;

  @IsDateString()
  @IsOptional()
  borrow_end_date?: Date;
}