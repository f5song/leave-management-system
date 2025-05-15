import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto, UpdateJobTitleDto } from './dto';

@Controller('job-titles')
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Post()
  create(@Body() createJobTitleDto: CreateJobTitleDto) {
    return this.jobTitleService.create(createJobTitleDto);
  }

  @Get()
  findAll() {
    return this.jobTitleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobTitleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobTitleDto: UpdateJobTitleDto) {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobTitleService.remove(id);
  }
}
