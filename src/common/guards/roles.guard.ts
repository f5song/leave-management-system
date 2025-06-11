import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { errorMessage } from '@src/common/constants/error-message';
import { EPermission } from '../constants/permission.enum';
import { ERole } from '../constants/roles.enum';
import { IRolePermission } from '../interfaces/role-permission.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<IRolePermission>('roles-permission', context.getHandler());

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new HttpException({ message: errorMessage['403'], code: '403' }, HttpStatus.FORBIDDEN);
    }

    if (requiredRoles?.role && requiredRoles.role.length > 0) {
      const hasRole = requiredRoles.role.includes(user.role)

      if (!hasRole) {
        throw new HttpException({ message: errorMessage['403'], code: '403' }, HttpStatus.FORBIDDEN);
      }
    }

    if (requiredRoles?.permissions && requiredRoles.permissions.length > 0) {
      const userPermissions: EPermission[] = user.permissions || [];

      const hasPermission = requiredRoles.permissions.every(p => userPermissions.includes(p));

      if (!hasPermission) {
        throw new HttpException({ message: errorMessage['403'], code: '403' }, HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }
}
