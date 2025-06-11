import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamUsersItemRequestId{

    @IsNotEmpty()
    @ApiProperty()
    id: string;
}