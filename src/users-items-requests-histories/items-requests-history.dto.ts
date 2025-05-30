import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsUUID, IsEnum } from 'class-validator';
import { ItemRequestHistoryStatus } from 'src/constants/item-request-history-status.enum';

export class CreateItemsRequestsHistoryDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  requestId: string;

  @IsEnum(ItemRequestHistoryStatus)
  status: ItemRequestHistoryStatus;
  
  @IsString()
  @IsOptional()
  reason?: string;
  
  @IsDate()
  @IsOptional()
  createdAt?: Date;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}

export class UpdateItemsRequestsHistoryDto {

  @IsEnum(ItemRequestHistoryStatus)
  @IsOptional()
  status?: ItemRequestHistoryStatus;
  
  @IsString()
  @IsOptional()
  reason?: string;
  
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}

export class ItemsRequestsHistoryResponseDto {
  id: string;

  userId: string;

  requestId: string;

  status: ItemRequestHistoryStatus;
  
  reason?: string;

  createdAt: Date;

  updatedAt: Date;

  user: {
    id: string;
    name: string;
    email: string;
  };

  request: {
    id: string;
    name: string;
    description: string;
  };
}
