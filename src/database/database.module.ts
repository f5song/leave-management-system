import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LeaveTypeEntity } from './entity/leave-types.entity';
import { LeaveEntity } from './entity/leaves.entity';
import { HolidayEntity } from './entity/holidays.entity';
import { RoleEntity } from './entity/roles.entity';
import { PermissionEntity } from './entity/permissions.entity';
import { UserEntity } from './entity/users.entity';
import { DepartmentEntity } from './entity/departments.entity';
import { JobTitleEntity } from './entity/job-titles.entity';
import { ItemEntity } from './entity/users-items.entity';
import { FacilityRequestEntity } from './entity/users-facility-requests.entity';
import { ItemRequestEntity } from './entity/users-items-request.entity';

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
        entities: [LeaveTypeEntity, LeaveEntity, HolidayEntity, RoleEntity, PermissionEntity, UserEntity, DepartmentEntity, JobTitleEntity, ItemEntity, FacilityRequestEntity, ItemRequestEntity],
        synchronize: true,
        logging: true
      }),
    }),
  ],
})
export class DatabaseModule { }
