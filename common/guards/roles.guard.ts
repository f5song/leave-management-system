import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) ||
                         this.reflector.get<string[]>('roles', context.getClass());
    
    console.log('Required roles:', requiredRoles);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
      console.error('No user or role found in request:', { user });
      return false;
    }

    // Convert to lowercase for case-insensitive comparison
    const userRole = user.role.toLowerCase();
    const requiredRolesLower = requiredRoles.map(role => role.toLowerCase());

    console.log('Role checking:', {
      userRole,
      requiredRoles: requiredRolesLower,
      match: requiredRolesLower.includes(userRole)
    });

    return requiredRolesLower.includes(userRole);
  }
}
