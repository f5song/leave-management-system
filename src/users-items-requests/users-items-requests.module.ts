import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsRequestsController } from './users-items-requests.controller';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../database/entity/users-items-requests-histories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersItemRequestEntity, UsersItemsRequestsHistoryEntity])],
  controllers: [UsersItemsRequestsController],
  providers: [UsersItemsRequestsService],
  exports: [UsersItemsRequestsService],
})
export class UsersItemsRequestsModule {}
