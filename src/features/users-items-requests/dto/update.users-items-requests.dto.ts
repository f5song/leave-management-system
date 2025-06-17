import { IsUUID, IsOptional, IsNumber, Min, IsEnum, IsDate } from "class-validator";
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

  @IsDate()
  @IsOptional()
  borrow_start_date?: Date;

  @IsDate()
  @IsOptional()
  borrow_end_date?: Date;
}