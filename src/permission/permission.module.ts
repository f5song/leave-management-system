import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../database/entity/permission.entity';
import { UserInfoEntity } from '../database/entity/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity,UserInfoEntity])],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {}
