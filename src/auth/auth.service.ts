import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
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

    // เช็คว่ามี user ที่ตรงกับ googleId หรือยัง
    let user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId }
    });

    if (!user) {
      // หา employee_code ใหม่
      const lastUser = await this.userRepository.findOne({
        where: { employeeCode: Not(IsNull()) },
        order: { createdAt: 'DESC' },
        select: ['employeeCode']
      });

      // ถ้าไม่มี user อยู่เลย หรือไม่มี employee_code ให้ใช้ fh_001
      const nextNumber = lastUser ?
        parseInt(lastUser.employeeCode.split('_')[1]) + 1 : 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      const employeeCode = `fh_${paddedNumber}`;

      // แยกชื่อและนามสกุล
      const nameParts = googleUser.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // สร้าง user ใหม่
      user = await this.userRepository.save({
        employeeCode: employeeCode,
        email: googleUser.email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleUser.googleId,
        avatarUrl: googleUser.picture,
        roleId: 'role-employee', // กำหนดเป็น user ตามค่า default
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // สร้าง JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }

  async validateAccount(accountId: string) {
    return this.userRepository.findOne({
      where: { id: accountId },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });
  }

  async findOrCreateUserFromGoogle(googleUser: { email: string; sub: string; firstName: string; lastName: string; picture: string }) {
    // ตรวจสอบว่ามี account ที่ตรงกับ google_id หรือยัง
    let account = await this.userRepository.findOne({
      where: { googleId: googleUser.sub },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });

    if (!account) {
      // สร้าง user
      const user = await this.userRepository.save({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture,
        roleId: 'role-employee', // กำหนดเป็น user ตามค่า default
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // สร้าง JWT
      const payload = {
        sub: user.id,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user
      };
    }

    return account;
  }
}
