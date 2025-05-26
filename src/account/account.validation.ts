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
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  googleId: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  approvedById?: string;
}


export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  googleId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  approvedById?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approvedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt?: Date;
}
