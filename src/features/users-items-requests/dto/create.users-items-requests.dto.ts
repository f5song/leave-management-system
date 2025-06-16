import { IsUUID, IsNumber, Min } from "class-validator";

export class CreateItemRequestDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
