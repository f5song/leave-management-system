import { Controller, Post, Get, Request, UseGuards, Body, Res } from '@nestjs/common';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserResponseDto } from '../users/respones/users.respones.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('google-login')
  async googleLogin(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const result = await this.authService.loginWithGoogle(loginDto.code);
  
    res.cookie('authToken', result.access_token, {
      httpOnly: true,
      // secure: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }
  

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  getProfile(@Request() req): Promise<UserResponseDto> {
    console.log(req.user);
    return req.user;
  }
}
