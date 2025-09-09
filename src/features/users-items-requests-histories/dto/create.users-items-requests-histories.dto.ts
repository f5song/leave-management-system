import { IsUUID, IsEnum, IsString, IsOptional, IsDate } from "class-validator";
import { EStatus } from "@src/common/constants/status.enum";

export class CreateItemsRequestsHistoryDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  requestId?: string;

  @IsEnum(EStatus)
  status: EStatus;
  
  @IsDate()
  @IsOptional()
  createdAt?: Date;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}