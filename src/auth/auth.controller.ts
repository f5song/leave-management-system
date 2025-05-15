import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService
  ) {}

  @Post('google-login')
  async googleLogin(@Body('idToken') idToken: string) {
    const user = await this.googleAuthService.validateUser(idToken);

    // สร้าง JWT token สำหรับ user นี้
    const payload = { email: user.email, sub: user.id };
    const access_token = this.authService.generateJwtToken(payload);

    return { access_token, user };
  }
}
