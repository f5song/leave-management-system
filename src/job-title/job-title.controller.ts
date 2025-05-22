import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto, UpdateJobTitleDto } from './job-title.validation';
import { JobTitleResponseDto } from './job-title-response.dto';

@Controller('job-titles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get()
  async findAll(): Promise<JobTitleResponseDto[]> {
    const jobTitles = await this.jobTitleService.findAll();
    return jobTitles.map(job => new JobTitleResponseDto(job));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobTitleResponseDto> {
    const jobTitle = await this.jobTitleService.findOne(id);
    return new JobTitleResponseDto(jobTitle);
  }

  @Post()
  async create(@Body() createJobTitleDto: CreateJobTitleDto): Promise<JobTitleResponseDto> {
    const jobTitle = await this.jobTitleService.create(createJobTitleDto);
    return new JobTitleResponseDto(jobTitle);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<JobTitleResponseDto> {
    const jobTitle = await this.jobTitleService.update(id, updateJobTitleDto);
    return new JobTitleResponseDto(jobTitle);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.jobTitleService.remove(id);
  }
}
