import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ELeaveStatus } from '../constants/leave-status.enum';

export class LeavePaginationDto {
  @ApiPropertyOptional({ description: 'กรองตาม userId' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'กรองตาม status' })
  @IsOptional()
  @IsString()
  status?: ELeaveStatus;
}
