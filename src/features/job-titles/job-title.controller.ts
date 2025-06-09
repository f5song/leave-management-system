import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto } from './dto/create.job-titles.dto';
import { UpdateJobTitleDto } from './dto/update.job-titles.dto';
import { JobTitleResponseDto } from './dto/job-titles.respones.dto';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@ApiTags('Job Titles')
@ApiBearerAuth('access-token')
@Controller('job-titles')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get()
  @ApiOkResponse({ type: [JobTitleEntity] })
  async findAll(): Promise<JobTitleEntity[]> {
    return this.jobTitleService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'employee')
  @ApiOkResponse({ type: JobTitleEntity })
  async findOne(@Param('id') id: EJobTitleId): Promise<JobTitleEntity> {
    return this.jobTitleService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiCreatedResponse({ type: JobTitleEntity })
  async create(@Body() createJobTitleDto: CreateJobTitleDto): Promise<JobTitleEntity> {
    return this.jobTitleService.create(createJobTitleDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOkResponse({ type: JobTitleEntity })
  async update(
    @Param('id') id: EJobTitleId,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<JobTitleEntity> {
    return this.jobTitleService.update(id, updateJobTitleDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOkResponse({ type: JobTitleEntity })
  async remove(@Param('id') id: EJobTitleId): Promise<void> {
    await this.jobTitleService.remove(id);
  }
}
