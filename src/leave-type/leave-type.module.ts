import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveTypeController } from './leave-type.controller';
import { LeaveTypeService } from './leave-type.service';
import { LeaveType } from './leave-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  controllers: [LeaveTypeController],
  providers: [LeaveTypeService],
  exports: [LeaveTypeService],
})
export class LeaveTypeModule {}
