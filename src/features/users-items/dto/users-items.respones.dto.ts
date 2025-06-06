import { EItemStatus } from "@common/constants/item-status.enum";
import { UserEntity } from "@src/database/entity/users.entity";
import { ItemRequestResponseDto } from "../../users-items-requests/dto/users-items-requests.respones.dto";

export class UserItemResponseDto {
    id: string;
    name: string;
    description: string;
    quantity: number;
    status: EItemStatus;
    createdBy: UserEntity;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
  }
  