import { EFacilityStatus } from "@src/common/constants/facility-status.enum";
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsEnum } from "class-validator";

export class CreateFacilityRequestDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

}