import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityRequestsController } from './users-facility-requests.controller';
import { FacilityRequestsService } from './users-facility-requests.service';
import { UsersFacilityRequestEntity } from '../../database/entity/users-facility-requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersFacilityRequestEntity])],
  controllers: [FacilityRequestsController],
  providers: [FacilityRequestsService],
})
export class UsersFacilityRequestsModule {}
