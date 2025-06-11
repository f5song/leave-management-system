import { IsNotEmpty, IsString, IsNumber, IsPositive, IsUUID } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    roleId: number;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    createdById: string;

    
}
