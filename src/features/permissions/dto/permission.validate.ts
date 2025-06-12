import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EPermission } from "@src/common/constants/permission.enum";

export class ValidateParamPermissionId{

    @IsNotEmpty()
    @ApiProperty()
    id: EPermission;
}