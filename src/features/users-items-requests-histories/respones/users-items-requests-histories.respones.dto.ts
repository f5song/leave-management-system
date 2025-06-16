import { EItemRequestStatus } from "@common/constants/item-request-status.enum";
import { UserEntity } from "../../../database/entity/users.entity";
import { UsersItemRequestEntity } from "../../../database/entity/users-items-requests.entity";

export class ItemsRequestsHistoryResponseDto {
  id: string;

  actionById?: string;

  actionType: EItemRequestStatus;

  actionAt: Date;

  borrow_start_date?: Date;

  borrow_end_date?: Date;

  request: UsersItemRequestEntity;


}
