import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entity/users.entity';
import { ERole } from '@src/common/constants/roles.enum';


@Injectable()
export class AuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) { }


  generateJwtToken(payload: { email: string; sub: string | number }) {
    return this.jwtService.sign(payload);
  }

  async verifyGoogleToken(idToken: string) {
    try {
      console.log(idToken);
      const { tokens } = await this.client.getToken(idToken);
      console.log(tokens);
      const ticket = await this.client.verifyIdToken({
        idToken: tokens.id_token,
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
    } catch (error) {
      console.log("google login error", error)
      throw error
    }
  }


  async loginWithGoogle(code: string) {
    const googleUser = await this.verifyGoogleToken(code);
  
    let user = await this.userRepository.findOne({
      where: { googleId: googleUser.googleId }
    });
  
    let isNewUser = false;
    let emailForRegister = null;
    let googleIdForRegister = null;
    let avatarForRegister = null;
  
    if (!user) {
      isNewUser = true;
      emailForRegister = googleUser.email;
      googleIdForRegister = googleUser.googleId;
      avatarForRegister = googleUser.picture || null; 
    }
  
    let userWithEmployeeCode = null;
    let accessToken = null;
  
    if (user) {
      emailForRegister = user.email;
  
      const payload = {
        sub: user.id,
        email: user.email,
      };
  
      accessToken = this.jwtService.sign(payload);
  
      userWithEmployeeCode = await this.userRepository.findOne({
        where: { id: user.id },
        select: [
          'id',
          'email',
          'firstName',
          'lastName',
          'employeeCode',
          'roleId',
          'googleId',
          'birthDate',
          'salary',
          'jobTitleId',
          'departmentId',
          'approvedAt',
          'avatarUrl' 
        ]
      });
    }
  
    return {
      access_token: accessToken,
      user: userWithEmployeeCode,
      isNewUser,
      email: emailForRegister,
      googleId: googleIdForRegister,
      avatarUrl: avatarForRegister,
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
        // avatarUrl: googleUser.picture,
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

  async validateUserWithPermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissionRoles', 'role.permissionRoles.permission'],
    });

    if (!user) return null;

    return user;
  }
}
