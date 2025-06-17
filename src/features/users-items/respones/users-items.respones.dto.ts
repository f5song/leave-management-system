import { EItemStatus } from "@common/constants/item-status.enum";
import { ItemRequestResponseDto } from "../../users-items-requests/respones/users-items-requests.respones.dto";
import { UserEntity } from "@src/database/entity/users.entity";
export class UserItemResponseDto {
    id: string;
    name: string;
    description: string;
    quantity: number;
    status: EItemStatus;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: UserEntity;
    itemRequests: ItemRequestResponseDto[];
  }
  