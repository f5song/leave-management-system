import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { UsersItemsController } from './users-items.controller';
import { AwsS3Module } from '../aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersItemEntity, UsersItemRequestEntity, UsersItemsRequestsHistoryEntity]),
    AwsS3Module,
  ],
  providers: [UsersItemsService],
  exports: [UsersItemsService],
  controllers: [UsersItemsController],
})
export class UsersItemsModule {}
