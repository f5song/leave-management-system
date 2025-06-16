import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { UsersItemsController } from './users-items.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersItemEntity, UsersItemRequestEntity]),
  ],
  providers: [UsersItemsService],
  exports: [UsersItemsService],
  controllers: [UsersItemsController],
})
export class UsersItemsModule {}
