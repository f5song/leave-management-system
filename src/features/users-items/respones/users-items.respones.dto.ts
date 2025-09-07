import { EItemStatus } from "@common/constants/item-status.enum";
import { ItemRequestResponseDto } from "../../users-items-requests/respones/users-items-requests.respones.dto";
import { UserEntity } from "@src/database/entity/users.entity";
import { IsUUID, IsString, IsNumber, IsEnum, IsDate } from "class-validator";
export class UserItemResponseDto {
  @IsUUID()
  id: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  quantity: number;
  @IsEnum(EItemStatus)
  status: EItemStatus;
  @IsUUID()
  createdById: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
  @IsDate()
  deletedAt: Date;
  @IsUUID()
  createdBy: UserEntity;
  
  itemRequests: ItemRequestResponseDto[];
}
