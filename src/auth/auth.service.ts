import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entity/users.entity';


@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }

  validateToken(authToken: any) {
    throw new Error('Method not implemented.');
  }

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
    let account = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });

    if (!account) {
      const [firstName = 'ชื่อ', lastName = 'นามสกุล'] = googleUser.name?.split(' ') || [];

      // สร้าง user ก่อน
      const user = await this.userRepository.save({
        first_name: firstName,
        last_name: lastName,
        email: googleUser.email
      });

      // สร้าง account พร้อมเชื่อมโยงกับ user
      account = await this.userRepository.save({
        email: googleUser.email,
        google_id: googleUser.googleId,
        user
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

  async validateAccount(accountId: string) {
    return this.userRepository.findOne({
      where: { id: accountId },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });
  }

  async findOrCreateUserFromGoogle(googleUser: { email: string; sub: string; name: string; picture: string }) {
    // ตรวจสอบว่ามี account ที่ตรงกับ google_id หรือยัง
    let account = await this.userRepository.findOne({
      where: { googleId: googleUser.sub },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });

    if (!account) {
      const [firstName = 'ชื่อ', lastName = 'นามสกุล'] = googleUser.name?.split(' ') || [];

      // สร้าง user
      const user = await this.userRepository.save({
        first_name: firstName,
        last_name: lastName,
        email: googleUser.email,
        google_id: googleUser.sub,
      });
    }

    return account;
  }
}
