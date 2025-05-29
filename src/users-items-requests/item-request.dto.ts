import { ItemRequestStatus } from '../constants/item-request-status.enum';
import { IsUUID, IsNumber, IsString, Min, IsEnum, IsOptional } from 'class-validator';
import { UserEntity } from '../database/entity/users.entity';

export class CreateItemRequestDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsUUID()
  requestedBy: UserEntity;
}

export class UpdateItemRequestDto {
  @IsUUID()
  @IsOptional()
  itemId?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsEnum(ItemRequestStatus)
  @IsOptional()
  status?: ItemRequestStatus;

  @IsUUID()
  @IsOptional()
  approvedBy?: UserEntity;
}

export class ItemRequestResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  itemId: string;

  @IsNumber()
  quantity: number;

  @IsEnum(ItemRequestStatus)
  status: ItemRequestStatus;

  @IsUUID()
  requestedBy: UserEntity;

  @IsOptional()
  approvedAt?: Date;

  @IsUUID()
  @IsOptional()
  approvedBy?: UserEntity;

  @IsOptional()
  returnedAt?: Date;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  deletedAt?: Date;

  static fromEntity(entity: any): ItemRequestResponseDto {
    const dto = new ItemRequestResponseDto();
    Object.assign(dto, entity);
    return dto;
  }
}
