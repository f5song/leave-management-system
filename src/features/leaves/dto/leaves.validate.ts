import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamLeaveId{

    @IsNotEmpty()
    @ApiProperty()
    @IsUUID()   
    leaveId: string;
}