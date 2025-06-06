import { IsNotEmpty, IsString } from "class-validator";

export class CreateFacilityRequestDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    description?: string;
    requestedById: string;
}