import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitleService } from './job-title.service';
import { JobTitleController } from './job-title.controller';
import { JobTitle } from './job-title.entity';
import { Department } from '../department/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobTitle, Department])],
  providers: [JobTitleService],
  controllers: [JobTitleController],
  exports: [JobTitleService],
})
export class JobTitleModule {}
