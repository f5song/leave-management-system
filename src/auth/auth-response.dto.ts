import { AccountEntity } from '../database/entity/account.entity';

export class AuthResponseDto {
  access_token: string;
  account: AccountEntity;
}
