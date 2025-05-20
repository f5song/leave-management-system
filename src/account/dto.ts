import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
  IsPositive,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  google_id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  approved_by?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approved_at?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  update_time?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  delete_time?: Date;
}


export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  google_id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  approved_by?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approved_at?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  update_time?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  delete_time?: Date;
}
