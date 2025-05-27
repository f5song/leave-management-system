import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsService } from './users-items.service';
import { ItemEntity } from '../database/entity/users-items.entity';
import { ItemRequestEntity } from '../database/entity/users-items-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, ItemRequestEntity]),
  ],
  providers: [UsersItemsService],
  exports: [UsersItemsService],
})
export class UsersItemsModule {}
