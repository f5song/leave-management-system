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

    // ตรวจสอบ role ถ้ามีการกำหนด requiredRoles.role
    if (requiredRoles?.role && requiredRoles.role.length > 0) {
      // แปลง user.role เป็น array เสมอ (รองรับกรณี role เดียวหรือหลาย role)
      const userRoles: ERole[] = Array.isArray(user.role) ? user.role : [user.role];

      // เช็คอย่างน้อยหนึ่ง role ของ user ตรงกับที่ requiredRoles กำหนดหรือไม่
      const hasRole = requiredRoles.role.some(r => userRoles.includes(r));
      const eiei =  requiredRoles.role.includes(user.role)

      if (!hasRole) {
        throw new HttpException({ message: errorMessage['403'], code: '403' }, HttpStatus.FORBIDDEN);
      }
    }

    // ตรวจสอบ permission ถ้ามีการกำหนด requiredRoles.permissions
    if (requiredRoles?.permissions && requiredRoles.permissions.length > 0) {
      const userPermissions: EPermission[] = user.permissions || [];

      // user ต้องมี permission ครบทุกตัวที่ requiredRoles ต้องการ
      const hasPermission = requiredRoles.permissions.every(p => userPermissions.includes(p));

      if (!hasPermission) {
        throw new HttpException({ message: errorMessage['403'], code: '403' }, HttpStatus.FORBIDDEN);
      }
    }

    return true;
  }
}
