import { IsNotEmpty, IsOptional, IsString, IsNumber, IsPositive, IsDate } from "class-validator";

export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    roleId?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    createdById?: string;

    @IsOptional()
    @IsDate()
    updateTime?: Date;
}