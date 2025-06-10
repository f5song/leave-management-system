import { Controller, Post, Get, Request, UseGuards, Body } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserEntity } from '../../database/entity/users.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('google-login')
  async googleLogin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.loginWithGoogle(loginDto.idToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Request() req): Promise<UserEntity> {
    return req.user;
  }
}
