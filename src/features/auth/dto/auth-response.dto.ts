import { UserEntity } from '../../../database/entity/users.entity';

export class AuthResponseDto {
  access_token: string;
  user: UserEntity;
}