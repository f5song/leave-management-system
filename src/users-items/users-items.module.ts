import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersItemEntity, UsersItemRequestEntity]),
  ],
  providers: [UsersItemsService],
  exports: [UsersItemsService],
})
export class UsersItemsModule {}
