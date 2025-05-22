import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitleService } from './job-title.service';
import { JobTitleController } from './job-title.controller';
import { JobTitleEntity } from '../database/entity/job-title.entity';
import { DepartmentEntity } from '../database/entity/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobTitleEntity, DepartmentEntity])],
  providers: [JobTitleService],
  controllers: [JobTitleController],
  exports: [JobTitleService],
})
export class JobTitleModule {}
