import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsRequestsController } from './users-items-requests.controller';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersItemRequestEntity])],
  controllers: [UsersItemsRequestsController],
  providers: [UsersItemsRequestsService],
  exports: [UsersItemsRequestsService],
})
export class UsersItemsRequestsModule {}
