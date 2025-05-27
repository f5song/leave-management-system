import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccountEntity } from './database/entity/account.entity';
import { LeaveTypeEntity } from './database/entity/leave-types.entity';
import { LeaveEntity } from './database/entity/leaves.entity';
import { HolidayEntity } from './database/entity/holidays.entity';
import { RoleEntity } from './database/entity/roles.entity';
import { PermissionEntity } from './database/entity/permissions.entity';
import { UserInfoEntity } from './database/entity/users.entity';
import { DepartmentEntity } from './database/entity/departments.entity';
import { JobTitleEntity } from './database/entity/job-titles.entity';
import { ItemEntity } from './database/entity/users-items.entity';
import { ItemRequestEntity } from './database/entity/users-items-request.entity';
import { FacilityRequestEntity } from './database/entity/users-facility-requests.entity';
// import { RolePermissionEntity } from './database/entity/role-permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DepartmentModule,
    JobTitleModule,
    UserModule,
    AccountModule,
    LeaveTypeModule,
    LeaveModule,
    HolidayModule,
    RoleModule,
    PermissionModule,
    AuthModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      AccountEntity, LeaveTypeEntity, LeaveEntity, HolidayEntity, RoleEntity, PermissionEntity, UserInfoEntity, DepartmentEntity, JobTitleEntity, ItemEntity, FacilityRequestEntity, ItemRequestEntity
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
