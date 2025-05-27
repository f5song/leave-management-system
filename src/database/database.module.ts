import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountEntity } from './entity/account.entity';
import { LeaveTypeEntity } from './entity/leave-type.entity';
import { LeaveEntity } from './entity/leave.entity';
import { HolidayEntity } from './entity/holiday.entity';
import { RoleEntity } from './entity/role.entity';
import { PermissionEntity } from './entity/permission.entity';
import { UserInfoEntity } from './entity/user-info.entity';
import { DepartmentEntity } from './entity/department.entity';
import { JobTitleEntity } from './entity/job-title.entity';
import { ItemEntity } from './entity/item.entity';
import { FacilityRequestEntity } from './entity/facility-request.entity';
import { ItemRequestEntity } from './entity/item-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        entities: [AccountEntity, LeaveTypeEntity, LeaveEntity, HolidayEntity, RoleEntity, PermissionEntity, UserInfoEntity, DepartmentEntity, JobTitleEntity, ItemEntity, FacilityRequestEntity, ItemRequestEntity],
        synchronize: true,
        logging: true
      }),
    }),
  ],
})
export class DatabaseModule { }
