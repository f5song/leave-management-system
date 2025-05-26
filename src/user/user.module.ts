import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoEntity } from '../database/entity/user-info.entity';
import { JobTitleEntity } from '../database/entity/job-title.entity';
import { DepartmentEntity } from '../database/entity/department.entity';
import { RoleEntity } from '../database/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfoEntity,JobTitleEntity,DepartmentEntity,RoleEntity])  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}