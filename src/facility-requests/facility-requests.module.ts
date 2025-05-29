import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacilityRequestsController } from './facility-requests.controller';
import { FacilityRequestsService } from './facility-requests.service';
import { FacilityRequestEntity } from '../database/entity/users-facility-requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacilityRequestEntity])],
  controllers: [FacilityRequestsController],
  providers: [FacilityRequestsService],
})
export class FacilityRequestsModule {}
