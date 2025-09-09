import {
    IsUUID,
    IsNumber,
    IsEnum,
    IsOptional,
    IsDate,
    ValidateNested,
  } from "class-validator";
  import { Type } from "class-transformer";
  import { EStatus } from "@src/common/constants/status.enum";
  import { UserEntity } from "../../../database/entity/users.entity";
  import { UsersItemEntity } from "../../../database/entity/users-items.entity";
  import { ItemsRequestsHistoryResponseDto } from "../../users-items-requests-histories/respones/users-items-requests-histories.respones.dto";
  
  export class ItemRequestResponseDto {
    @IsUUID()
    id: string;
  
    @IsNumber()
    quantity: number;
  
    @IsEnum(EStatus)
    status: EStatus;
  
    @IsOptional()
    requestedBy?: UserEntity;
  

    @IsOptional()
    @IsDate()
    actionAt?: Date;
  
  
    @IsOptional()
    @IsDate()
    createdAt: Date;
  
    @IsOptional()
    @IsDate()
    deletedAt?: Date;

    @IsOptional()
    @IsUUID()
    requestedById?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ItemsRequestsHistoryResponseDto)
    history?: ItemsRequestsHistoryResponseDto[];

    @IsOptional()
    @IsUUID()
    approvedById?: string;

    @IsOptional()
    @IsUUID()
    itemId: string;

    @IsOptional()
    @IsUUID()
    item?: UsersItemEntity;

    @IsOptional()
    @IsUUID()
    approvedBy?: UserEntity;

    @IsOptional()
    @IsDate()
    borrow_start_date?: Date;

    @IsOptional()
    @IsDate()
    borrow_end_date?: Date;
  }
  