import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuthModule } from '../auth/auth.module';
import { LeaveEntity } from '../database/entity/leaves.entity';
import { UserEntity } from '../database/entity/users.entity';
import { LeaveTypeEntity } from '../database/entity/leave-types.entity';
import { HolidayEntity } from '../database/entity/holidays.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([LeaveEntity, UserEntity, LeaveTypeEntity, HolidayEntity])
  ],
  controllers: [LeaveController],
  providers: [LeaveService]
})
export class LeaveModule {}