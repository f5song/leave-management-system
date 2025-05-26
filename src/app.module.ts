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
import { LeaveTypeEntity } from './database/entity/leave-type.entity';
import { LeaveEntity } from './database/entity/leave.entity';
import { HolidayEntity } from './database/entity/holiday.entity';
import { RoleEntity } from './database/entity/role.entity';
import { PermissionEntity } from './database/entity/permission.entity';
import { UserInfoEntity } from './database/entity/user-info.entity';
import { DepartmentEntity } from './database/entity/department.entity';
import { JobTitleEntity } from './database/entity/job-title.entity';
import { ItemEntity } from './database/entity/item.entity';
import { ItemRequestEntity } from './database/entity/item-request.entity';
import { FacilityRequestEntity } from './database/entity/facility-request.entity';

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
