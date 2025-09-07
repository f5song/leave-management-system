import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
export class PaginationDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()           
    page?: number = 1;      
  
    @ApiProperty({ required: false, default: 9 })
    @IsOptional()           
    limit?: number = 9;
  }
  