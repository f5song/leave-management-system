import { ApiProperty } from "@nestjs/swagger";
import { DepartmentResponseDto } from "./department.respones";

export class UpdateDepartmentResponseDto extends DepartmentResponseDto {
    @ApiProperty({ example: '2025-06-10T14:00:43.000Z' })
    updated_at: Date;
}