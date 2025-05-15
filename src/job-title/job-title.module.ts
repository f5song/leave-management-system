import { Module } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { JobTitleController } from './job-title.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [JobTitleController],
  providers: [JobTitleService, PrismaService],
})
export class JobTitleModule {}
