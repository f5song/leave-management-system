import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { AuthModule } from '../auth/auth.module';
import { Leave } from './leave.entity';
import { User } from '../auth/user.entity';
import { LeaveType } from '../leave-type/leave-type.entity';
import { Holiday } from '../holiday/holiday.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Leave, User, LeaveType, Holiday])
  ],
  controllers: [LeaveController],
  providers: [LeaveService]
})
export class LeaveModule {}