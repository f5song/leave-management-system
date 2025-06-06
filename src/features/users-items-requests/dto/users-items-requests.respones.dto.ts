import {
    IsUUID,
    IsNumber,
    IsEnum,
    IsOptional,
    IsDate,
    ValidateNested,
  } from "class-validator";
  import { Type } from "class-transformer";
  import { EItemRequestStatus } from "@common/constants/item-request-status.enum";
  import { UserEntity } from "../../../database/entity/users.entity";
  import { UsersItemEntity } from "../../../database/entity/users-items.entity";
  import { ItemsRequestsHistoryResponseDto } from "../../users-items-requests-histories/dto/users-items-requests-histories.respones.dto";
  
  export class ItemRequestResponseDto {
    @IsUUID()
    id: string;
  
    @IsUUID()
    itemId: string;
  
    @IsNumber()
    quantity: number;
  
    @IsEnum(EItemRequestStatus)
    status: EItemRequestStatus;
  
    @IsOptional()
    requestedBy?: string;
  

    @IsOptional()
    @IsDate()
    actionAt?: Date;
  
  
    @IsOptional()
    @IsDate()
    createdAt: Date;
  
    @IsOptional()
    @IsDate()
    deletedAt?: Date;
  }
  