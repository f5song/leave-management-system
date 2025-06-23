import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport/dist';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../features/auth/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: false,
      name: 'jwt'
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUserWithPermissions(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      employeeCode: user.employeeCode,
      googleId: user.googleId,
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickName,
      avatarUrl: user.avatarUrl,
      birthDate: user.birthDate,
      salary: user.salary,
      jobTitleId: user.jobTitleId,
      departmentId: user.departmentId,
      approvedAt: user.approvedAt,
      email: user.email,
      role: user.role.name, 
      permissions: user.role.permissionRoles.map(pr => pr.permission.id), 
    };
  }
}
