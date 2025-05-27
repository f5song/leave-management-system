import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../database/entity/roles.entity';
import { UserEntity } from '../database/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity,UserEntity])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
