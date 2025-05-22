import { UserInfoEntity } from '../database/entity/user-info.entity';

export class AuthResponseDto {
  access_token: string;
  user: UserInfoEntity;
}
