import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './departments/department.module';
import { JobTitleModule } from './job-titles/job-title.module';
import { UserModule } from './users/user.module';
import { LeaveTypeModule } from './leave-types/leave-type.module';
import { LeaveModule } from './leaves/leave.module';
import { HolidayModule } from './holidays/holiday.module';
import { RoleModule } from './roles/role.module';
import { PermissionModule } from './permissions/permission.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { LeaveTypeEntity } from './database/entity/leave-types.entity';
import { LeaveEntity } from './database/entity/leaves.entity';
import { HolidayEntity } from './database/entity/holidays.entity';
import { RoleEntity } from './database/entity/roles.entity';
import { PermissionEntity } from './database/entity/permissions.entity';
import { UserEntity } from './database/entity/users.entity';
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
      LeaveTypeModule,
    LeaveModule,
    HolidayModule,
    RoleModule,
    PermissionModule,
    AuthModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      LeaveTypeEntity, LeaveEntity, HolidayEntity, RoleEntity, PermissionEntity, UserEntity, DepartmentEntity, JobTitleEntity, ItemEntity, FacilityRequestEntity, ItemRequestEntity
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
