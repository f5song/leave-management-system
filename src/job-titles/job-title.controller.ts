import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto, UpdateJobTitleDto, JobTitleResponseDto } from './job-title.dto';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { JobTitleEntity } from 'src/database/entity/job-titles.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Job Titles')
@Controller('job-titles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [JobTitleEntity] })
  async findAll(): Promise<JobTitleEntity[]> {
    return this.jobTitleService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: JobTitleEntity })
  async findOne(@Param('id') id: JobTitleId): Promise<JobTitleEntity> {
    return this.jobTitleService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: JobTitleEntity })
  async create(@Body() createJobTitleDto: CreateJobTitleDto): Promise<JobTitleEntity> {
    return this.jobTitleService.create(createJobTitleDto);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: JobTitleEntity })
  async update(
    @Param('id') id: JobTitleId,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<JobTitleEntity> {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: JobTitleEntity })
  async remove(@Param('id') id: JobTitleId): Promise<void> {
    await this.jobTitleService.remove(id);
  }
}
