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
import { UsersItemRequestEntity } from './database/entity/users-items-requests.entity';
import { UsersFacilityRequestEntity } from './database/entity/users-facility-requests.entity';
import { UsersItemsRequestsHistoryEntity } from './database/entity/users-items-requests-histories.entity';
import { UsersItemsRequestsModule } from './users-items-requests/users-items-requests.module';
import { UsersItemsRequestsHistoriesModule } from './users-items-requests-histories/users-items-requests-histories.module';
import { UsersItemsModule } from './users-items/users-items.module';
import { UsersFacilityRequestsModule } from './users-facility-requests/users-facility-requests.module';
import { UsersItemEntity } from './database/entity/users-items.entity';

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
    UsersItemsModule,
    UsersItemsRequestsModule,
    UsersItemsRequestsHistoriesModule,
    UsersFacilityRequestsModule,
    TypeOrmModule.forFeature([
      LeaveTypeEntity,
      LeaveEntity,
      HolidayEntity,
      RoleEntity,
      PermissionEntity,
      UserEntity,
      DepartmentEntity,
      JobTitleEntity,
      UsersItemRequestEntity,
      UsersFacilityRequestEntity,
      UsersItemsRequestsHistoryEntity,
      UsersItemEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
