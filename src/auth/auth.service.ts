import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  generateJwtToken(payload: { email: string; sub: string | number }) {
    return this.jwtService.sign(payload);
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub,
      picture: payload.picture,
    };
  }

  async loginWithGoogle(idToken: string) {
    const googleUser = await this.verifyGoogleToken(idToken);

    // เช็คว่ามี account ที่ตรงกับ google_id หรือยัง
    let account = await this.prisma.account.findUnique({
      where: {
        google_id: googleUser.googleId,
      },
      include: {
        user: true,
      },
    });

    if (!account) {
      const [firstName = 'ชื่อ', lastName = 'นามสกุล'] = googleUser.name?.split(' ') || [];

      const user = await this.prisma.userInfo.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email: googleUser.email,
        },
      });

      account = await this.prisma.account.create({
        data: {
          email: googleUser.email,
          google_id: googleUser.googleId,
          user: { connect: { id: user.id } },
        },
        include: {
          user: true,
        },
      });
    }

    // สร้าง JWT
    const payload = {
      sub: account.id,
      email: account.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      account,
    };
  }
  async validateAccount(accountId: number) {
    return this.prisma.account.findUnique({
      where: { id: accountId },
      include: { user: true }
    });
  }

  async findOrCreateUserFromGoogle(googleUser: { email: string; sub: string; name: string; picture: string }) {
    // สมมติเช็คในฐานข้อมูล Account ด้วย google_id (sub)
    let account = await this.prisma.account.findUnique({
      where: { google_id: googleUser.sub },
      include: { user: true },
    });

    if (!account) {
      const [firstName = 'ชื่อ', lastName = 'นามสกุล'] = googleUser.name?.split(' ') || [];

      const newUser = await this.prisma.userInfo.create({
        data: {
          email: googleUser.email,
          first_name: firstName,
          last_name: lastName,
        },
      });


      // สร้าง Account เชื่อมกับ UserInfo
      account = await this.prisma.account.create({
        data: {
          google_id: googleUser.sub,
          email: googleUser.email,
          user_id: newUser.id,
        },
        include: { user: true },
      });
    }

    return account.user;
  }
}
