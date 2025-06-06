import { EItemRequestStatus } from "@common/constants/item-request-status.enum";

export class ItemsRequestsHistoryResponseDto {
  id: string;

  requestId: string;

  actionBy: string;

  actionType: EItemRequestStatus;

  actionAt: Date;

  borrow_start_date: Date;

  borrow_end_date: Date;
}
