import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserInfo } from '../user/user-info.entity'; 

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(userId: number): Promise<UserInfo | null> {
    const user = await this.userService.getUserById(userId);
    return user as unknown as UserInfo;
  }

  async login(user: UserInfo) {
    const payload = { name: user.name, sub: user.id }; // Adjust based on UserInfo structure
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
