import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamLeaveId{

    @IsNotEmpty()
    @ApiProperty()
    leaveId: string;
}