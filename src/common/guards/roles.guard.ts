import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new HttpException(
        {
          message: errorMessage['403'],
          code: '403',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const userRole = user.role.toLowerCase();
    const requiredRolesLower = requiredRoles.map((role) => role.toLowerCase());

    if (!requiredRolesLower.includes(userRole)) {
      throw new HttpException(
        {
          message: errorMessage['403'], // ใช้ข้อความ Forbidden
          code: '403',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
