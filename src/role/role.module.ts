import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../database/entity/role.entity';
import { UserInfoEntity } from '../database/entity/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity,UserInfoEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
