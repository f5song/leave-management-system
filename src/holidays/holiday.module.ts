import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayEntity } from '../database/entity/holidays.entity';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HolidayEntity])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule { }
