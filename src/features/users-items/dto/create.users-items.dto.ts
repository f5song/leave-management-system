import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, Min, ValidateNested } from "class-validator";
import { EItemStatus } from "@common/constants/item-status.enum";
import { UserEntity } from "@src/database/entity/users.entity";
import { Type } from "class-transformer";

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNotEmpty()
  @IsEnum(EItemStatus)
  status: EItemStatus;

  @IsNotEmpty()
  @Type(() => UserEntity)
  @ValidateNested()
  createdBy: UserEntity;
}
