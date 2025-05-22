import { User } from './user.entity';

export class AuthResponseDto {
  access_token: string;
  user: User;
}
