import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { RoleGuard } from './role.guard';

@Module({
  imports: [PrismaModule],
  providers: [UserService, RoleGuard],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}