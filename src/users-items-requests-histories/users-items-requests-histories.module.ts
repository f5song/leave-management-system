import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsRequestsHistoriesController } from './users-items-requests-histories.controller';
import { UsersItemsRequestsHistoriesService } from './users-items-requests-histories.service';
import { UsersItemsRequestsHistoryEntity } from '../database/entity/users-items-requests-histories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersItemsRequestsHistoryEntity])],
  controllers: [UsersItemsRequestsHistoriesController],
  providers: [UsersItemsRequestsHistoriesService],
  exports: [UsersItemsRequestsHistoriesService],
})
export class UsersItemsRequestsHistoriesModule {}
