import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto, UpdateJobTitleDto, JobTitleResponseDto } from './job-title.dto';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { JobTitleEntity } from 'src/database/entity/job-titles.entity';

@Controller('job-titles')
@UseInterceptors(ClassSerializerInterceptor)
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get()
  async findAll(): Promise<JobTitleEntity[]> {
    return this.jobTitleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: JobTitleId): Promise<JobTitleEntity> {
    return this.jobTitleService.findOne(id);
  }

  @Post()
  async create(@Body() createJobTitleDto: CreateJobTitleDto): Promise<JobTitleEntity> {
    return this.jobTitleService.create(createJobTitleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: JobTitleId,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<JobTitleEntity> {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: JobTitleId): Promise<void> {
    await this.jobTitleService.remove(id);
  }
}
