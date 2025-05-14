import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { JobTitleModule } from './job-title/job-title.module';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { LeaveTypeModule } from './leave-type/leave-type.module';
import { LeaveModule } from './leave/leave.module';
import { HolidayModule } from './holiday/holiday.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DepartmentModule, JobTitleModule, UserModule, AccountModule, LeaveTypeModule, LeaveModule, HolidayModule, RoleModule, PermissionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
