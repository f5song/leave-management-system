import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { UserEntity } from '../../database/entity/users.entity';
import { ERole } from '@src/common/constants/roles.enum';


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

    let user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId }
    });

    if (!user) {

      const lastUser = await this.userRepository.findOne({
        where: { employeeCode: Not(IsNull()) },
        order: { createdAt: 'DESC' },
        select: ['employeeCode']
      });

      let employeeCode: string;
      if (!lastUser || !lastUser.employeeCode) {
        employeeCode = 'fh-0001';   
      } else {
        const match = lastUser.employeeCode.match(/\d+$/);
        const nextNumber = match ? parseInt(match[0]) + 1 : 1;
        const paddedNumber = nextNumber.toString().padStart(4, '0');
        employeeCode = `fh-${paddedNumber}`;
      }

      const nameParts = googleUser.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';


      const newUser = this.userRepository.create({
        employeeCode: employeeCode,
        email: googleUser.email,
        firstName: firstName,
        lastName: lastName,
        googleId: googleUser.googleId,
        avatarUrl: googleUser.picture,
        roleId: ERole.EMPLOYEE,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      user = await this.userRepository.save(newUser);
      const savedUser = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'email', 'firstName', 'lastName', 'employeeCode', 'roleId', 'googleId', 'avatarUrl']
      });

    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const userWithEmployeeCode = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'email', 'firstName', 'lastName', 'employeeCode', 'roleId']
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithEmployeeCode
    };
  }

  async validateUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async findOrCreateUserFromGoogle(googleUser: { email: string; sub: string; firstName: string; lastName: string; picture: string }) {
    let account = await this.userRepository.findOne({
      where: { googleId: googleUser.sub },
      relations: ['createdLeaves', 'leaves', 'itemRequests', 'itemApprovals', 'facilityRequests', 'facilityApprovals']
    });

    if (!account) {
      const user = await this.userRepository.save({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        email: googleUser.email,
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture,
        roleId: ERole.EMPLOYEE,
        createdAt: new Date(),
        updatedAt: new Date()
      });
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
