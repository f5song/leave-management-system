import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamPermissionId{

    @IsNotEmpty()
    @ApiProperty()
    id: string;
}