import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entity/users.entity';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { RoleEntity } from '../../database/entity/roles.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { UsersFacilityRequestEntity } from '../../database/entity/users-facility-requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,JobTitleEntity,DepartmentEntity,RoleEntity,UsersItemRequestEntity, UsersItemsRequestsHistoryEntity, UsersFacilityRequestEntity])  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}