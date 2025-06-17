import { IsUUID, IsNumber, Min, IsDate } from "class-validator";

export class CreateItemRequestDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDate()
  borrow_start_date: Date;

  @IsDate()
  borrow_end_date: Date;
}
