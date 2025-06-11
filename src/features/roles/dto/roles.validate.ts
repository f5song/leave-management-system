import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamRoleId{

    @IsNotEmpty()
    @ApiProperty()
    id: string;
}
