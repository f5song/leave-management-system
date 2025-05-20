import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional, IsDate } from 'class-validator';

export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    role_id?: number;

    @IsOptional()
    @IsDate()
    update_time?: Date;
}

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsPositive()
    role_id: number;

    @IsNumber()
    @IsPositive()
    created_by: number;
}
