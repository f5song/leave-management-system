import { Module } from '@nestjs/common';
import { JobTitleController } from './job-title.controller';
import { JobTitleService } from './job-title.service';

@Module({
  controllers: [JobTitleController],
  providers: [JobTitleService]
})
export class JobTitleModule {}
