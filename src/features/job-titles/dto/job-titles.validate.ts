import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EJobTitleId } from "@common/constants/jobtitle.enum";

export class ValidateParamJobTitleId{

    @IsNotEmpty()
    @ApiProperty()
    @IsEnum(EJobTitleId)
    id: EJobTitleId;
}