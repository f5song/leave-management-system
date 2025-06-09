import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EAuthGuard } from '../constants/authguard.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard(EAuthGuard.JWT) {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
}