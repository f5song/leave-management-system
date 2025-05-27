import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional, IsDate, IsUUID } from 'class-validator';

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
