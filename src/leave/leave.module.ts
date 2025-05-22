import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuthModule } from '../auth/auth.module';
import { LeaveEntity } from '../database/entity/leave.entity';
import { UserInfoEntity } from '../database/entity/user-info.entity';
import { LeaveTypeEntity } from '../database/entity/leave-type.entity';
import { HolidayEntity } from '../database/entity/holiday.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([LeaveEntity, UserInfoEntity, LeaveTypeEntity, HolidayEntity])
  ],
  controllers: [LeaveController],
  providers: [LeaveService]
})
export class LeaveModule {}