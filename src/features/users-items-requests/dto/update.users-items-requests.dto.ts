import { IsUUID, IsOptional, IsNumber, Min, IsEnum } from "class-validator";
import { EItemRequestStatus } from "@common/constants/item-request-status.enum";
import { UserEntity } from "../../../database/entity/users.entity";

export class UpdateItemRequestDto {
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

  @IsOptional()
  action_at?: Date;

  @IsOptional()
  deleted_at?: Date;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  requested_by?: string;
}