import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamUsersFacilityRequestId{

    @IsNotEmpty()
    @ApiProperty()
    id: string;
}