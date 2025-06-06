import { IsUUID, IsNumber, Min } from "class-validator";
import { UserEntity } from "../../../database/entity/users.entity";

export class CreateItemRequestDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsUUID()
  requestedBy: UserEntity;
}
