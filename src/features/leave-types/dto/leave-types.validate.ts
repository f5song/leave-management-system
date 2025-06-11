import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ELeaveType } from "@common/constants/leave-type.enum";

export class ValidateParamLeaveTypeId{

    @IsNotEmpty()
    @ApiProperty()
    @IsEnum(ELeaveType)
    id: ELeaveType;
}