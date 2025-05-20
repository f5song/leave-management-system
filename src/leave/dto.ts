import { IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsEnum, registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

export enum LeaveStatus {
    APPROVED = 'approved',
    REJECTED = 'rejected',
    PENDING = 'pending'
}

export class CreateLeaveDto {
    @IsNotEmpty()
    @IsString()
    leave_type_id: string;

    @IsDate()
    @IsFutureDate()
    start_date: Date;

    @IsDate()
    @IsFutureDate()
    end_date: Date;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    @IsNotEmpty()
    reason: string;
}

export class UpdateLeaveStatusDto {
    @IsEnum(LeaveStatus)
    status: LeaveStatus;
}

export class UpdateLeaveDto {
    @IsOptional()
    @IsDateString()
    @IsDate()
    start_date?: Date;

    @IsOptional()
    @IsDateString()
    @IsDate()
    @IsFutureDate()
    end_date?: Date;

    @IsOptional()
    @IsString()
    @MinLength(10)
    @MaxLength(500)
    reason?: string;

    @IsOptional()
    @IsString()
    leave_type_id?: string;
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isFutureDate',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: any) {
            return value instanceof Date && value > new Date();
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be a future date`;
          },
        },
      });
    };
}