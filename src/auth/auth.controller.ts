import { Controller, Post, Get, Request, UseGuards, Body } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google.strategy';
import { LoginDto } from './auth.validation';
import { AuthResponseDto } from './auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserInfoEntity } from '../database/entity/user-info.entity';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService
  ) {}

  @Post('google-login')
  async googleLogin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.googleAuthService.validateUser(loginDto.idToken);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<UserInfoEntity> {
    return req.user;
  }
}
