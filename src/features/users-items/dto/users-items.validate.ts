import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamUsersItemId{

    @IsNotEmpty()
    @ApiProperty()
    id: string;
}