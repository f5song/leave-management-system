import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ERole } from "@src/common/constants/roles.enum";

export class ValidateParamRoleId{

    @IsNotEmpty()
    @ApiProperty()
    id: ERole;
}
