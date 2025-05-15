import { IsString, Length, IsOptional } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @Length(1, 20)
  id: string;

  @IsString()
  name: string;
}
export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  name?: string;
}
