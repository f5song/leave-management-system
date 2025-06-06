import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private authService: AuthService) { 
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub, // google user id
    };
  }

  async validateUser(idToken: string) {
    const googleUser = await this.verifyIdToken(idToken);

    const user = await this.authService.findOrCreateUserFromGoogle(googleUser);

    if (!user) {
      throw new UnauthorizedException('User not found or cannot create user');
    }

    return user;
  }
}
