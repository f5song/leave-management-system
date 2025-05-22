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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'leave_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      timezone: '+07:00'
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
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
