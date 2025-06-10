import { EDepartmentId } from "@src/common/constants/department.enum";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ValidateParamDepartmentId{

    @IsNotEmpty()
    @IsEnum(EDepartmentId)
    @ApiProperty()
    id: EDepartmentId;
}