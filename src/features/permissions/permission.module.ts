import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../../database/entity/permissions.entity';
import { UserEntity } from '../../database/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity,UserEntity])],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
