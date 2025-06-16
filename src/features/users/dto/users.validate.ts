import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamUserId{

    @IsNotEmpty()
    @ApiProperty()
    userId: string;
}