import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
