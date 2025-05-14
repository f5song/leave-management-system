import { Module } from '@nestjs/common';
import { LeaveTypeController } from './leave-type.controller';
import { LeaveTypeService } from './leave-type.service';

@Module({
  controllers: [LeaveTypeController],
  providers: [LeaveTypeService]
})
export class LeaveTypeModule {}
