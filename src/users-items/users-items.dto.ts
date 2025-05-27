import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ItemCategoryId } from '../constants/item-category.enum';
import { ItemStatus } from '../constants/item-status.enum';
import { UnitType } from '../constants/item-unit.enum';

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(ItemCategoryId)
  categoryId: ItemCategoryId;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsEnum(UnitType)
  unit: UnitType;

  @IsNotEmpty()
  @IsEnum(ItemStatus)
  status: ItemStatus;
}

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ItemCategoryId)
  categoryId?: ItemCategoryId;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(UnitType)
  unit?: UnitType;

  @IsOptional()
  @IsEnum(ItemStatus)
  status?: ItemStatus;
}

export class ItemRequestDto {
  @IsNotEmpty()
  @IsUUID('4')
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
