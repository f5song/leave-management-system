import { IsString, Length, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  @Length(1, 20)      
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}

export class UpdateLeaveTypeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;
}
