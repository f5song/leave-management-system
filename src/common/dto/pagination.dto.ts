import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EStatus } from "../constants/status.enum";
export class PaginationDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()           
    page?: number;      
  
    @ApiProperty({ required: false, default: 9 })
    @IsOptional()           
    limit?: number;

    @ApiPropertyOptional({ description: 'กรองตาม userId' })
    @IsOptional()
    @IsString()
    userId?: string;
  
    @ApiPropertyOptional({ description: 'กรองตาม status' })
    @IsOptional()
    @IsString()
    status?: EStatus;
  }
  