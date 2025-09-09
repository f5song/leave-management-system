import { Controller, Get, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RequestWithUser } from '@src/common/interfaces/request-with-user';
import { JwtAuthGuard } from '@src/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  // Google OAuth login redirect
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  // Google login callback
  @Post('google-login')
  async googleLogin(@Body('code') code: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.loginWithGoogle(code);

    // เซ็ต HttpOnly cookie
    res.cookie('authToken', result.accessToken ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 วัน
      path: '/',
    });

    // return ข้อมูลให้ frontend
    return {
      access_token: result.accessToken,
      user: result.user,
      isNewUser: result.isNewUser,
      email: result.email,
      googleId: result.googleId,
      avatarUrl: result.avatarUrl,
    };
  }

  // Logout
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      res
        .clearCookie('authToken', {
          httpOnly: true,
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        })
        .status(200)
        .json({ message: 'Logged out successfully' });
      console.log('Logged out successfully');
    } catch (error) {
      console.log('Logout failed', error);
      throw error;
    }
  }

  @Get('check')
  checkAuth(@Req() req: Request) {
    const token = req.cookies['authToken']; // อ่าน HttpOnly cookie
    if (token) return { isAuthenticated: true };
    return { isAuthenticated: false };
  }

}
