import { Module } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [LeaveController],
  providers: [LeaveService, PrismaService]
})
export class LeaveModule {}