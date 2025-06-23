import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./users.respones.dto";

export class UserWithTokenResponseDto {
    @ApiProperty()
    user: UserResponseDto;
  
    @ApiProperty()
    access_token: string;
  }
  