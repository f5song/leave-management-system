import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto, UpdateJobTitleDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
