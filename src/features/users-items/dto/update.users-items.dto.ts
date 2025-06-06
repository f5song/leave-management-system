import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, Min } from "class-validator";
import { EItemCategoryId } from "@common/constants/item-category.enum";
import { EItemStatus } from "@common/constants/item-status.enum";
import { EUnitType } from "@common/constants/item-unit.enum";
import { UserEntity } from "@src/database/entity/users.entity";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(EItemStatus)
  status?: EItemStatus;

  @IsOptional()
  @Type(() => UserEntity)
  @ValidateNested()
  createdBy?: UserEntity;
}
