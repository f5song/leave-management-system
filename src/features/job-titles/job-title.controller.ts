import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, ClassSerializerInterceptor, UseGuards, ValidationPipe, UsePipes, HttpStatus } from '@nestjs/common';
import { JobTitleService } from './job-title.service';
import { CreateJobTitleDto } from './dto/create.job-titles.dto';
import { UpdateJobTitleDto } from './dto/update.job-titles.dto';
import { JobTitleResponseDto } from './respones/job-titles.respones.dto';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '@src/common/decorators/roles-permission.decorator';
import { EPermission } from '@common/constants/permission.enum';
import { ERole } from '@common/constants/roles.enum';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { ValidateParamJobTitleId } from '../job-titles/dto/job-titles.validate';

@ApiTags('Job Titles')
@Controller('job-titles')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)

export class JobTitleController {
  constructor(private readonly jobTitleService: JobTitleService) {}

  @Get()
  @ApiResponseSuccess({ type: [JobTitleResponseDto] })
  @ApiResponseError([
    {
      code: '0101',
      message: errorMessage['0101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0102',
      message: errorMessage['0102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0103',
      message: errorMessage['0103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0104',
      message: errorMessage['0104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0105',
      message: errorMessage['0105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  async findAll(): Promise<ResponseObject<JobTitleResponseDto[]>> {
    const jobTitles = await this.jobTitleService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: jobTitles,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: JobTitleResponseDto })
  @ApiResponseError([
    {
      code: '0101',
      message: errorMessage['0101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0102',
      message: errorMessage['0102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0103',
      message: errorMessage['0103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0104',
      message: errorMessage['0104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0105',
      message: errorMessage['0105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_JOB_TITLE] })
  @ApiOkResponse({ type: JobTitleResponseDto })
  async findOne(@Param() param: ValidateParamJobTitleId): Promise<ResponseObject<JobTitleResponseDto>> {
    const jobTitle = await this.jobTitleService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: jobTitle,
    };
  }

  @Post()
  @ApiOkResponse({ type: JobTitleResponseDto })
  @ApiResponseError([
    {
      code: '0101',
      message: errorMessage['0101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0102',
      message: errorMessage['0102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0103',
      message: errorMessage['0103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0104',
      message: errorMessage['0104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0105',
      message: errorMessage['0105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_JOB_TITLE] })
  @ApiCreatedResponse({ type: JobTitleResponseDto })
  async create(@Body() createJobTitleDto: CreateJobTitleDto): Promise<ResponseObject<JobTitleResponseDto>> {
    const jobTitle = await this.jobTitleService.create(createJobTitleDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: jobTitle,
    };
  }

  @Put(':id')
  @ApiOkResponse({ type: JobTitleResponseDto })
  @ApiResponseError([
    {
      code: '0101',
      message: errorMessage['0101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0102',
      message: errorMessage['0102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0103',
      message: errorMessage['0103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0104',
      message: errorMessage['0104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0105',
      message: errorMessage['0105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_JOB_TITLE] })
  @ApiOkResponse({ type: JobTitleResponseDto })
  async update(
    @Param() param: ValidateParamJobTitleId,
    @Body() updateJobTitleDto: UpdateJobTitleDto,
  ): Promise<ResponseObject<JobTitleResponseDto>> {
    const jobTitle = await this.jobTitleService.update(param.id, updateJobTitleDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: jobTitle,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: JobTitleResponseDto })
  @ApiResponseError([
    {
      code: '0101',
      message: errorMessage['0101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0102',
      message: errorMessage['0102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0103',
      message: errorMessage['0103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0104',
      message: errorMessage['0104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0105',
      message: errorMessage['0105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_JOB_TITLE] })
  @ApiOkResponse({ type: JobTitleResponseDto })
  async remove(@Param() param: ValidateParamJobTitleId): Promise<void> {
    await this.jobTitleService.softDelete(param.id);
  }
}
