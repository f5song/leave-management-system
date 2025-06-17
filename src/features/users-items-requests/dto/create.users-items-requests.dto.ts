import { IsUUID, IsNumber, Min, IsDate, IsDateString } from "class-validator";

export class CreateItemRequestDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDateString()
  borrow_start_date: Date;

  @IsDateString()
  borrow_end_date: Date;
}
