import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto} from './dto/create.holidays.dto';
import { UpdateHolidayDto } from './dto/update.holidays.dto';
import { HolidayResponseDto } from './response/holidays.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { EPermission } from '@common/constants/permission.enum';
import { ERole } from '@common/constants/roles.enum';
import { ResponseObject } from '@common/dto/common-response.dto';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';
import { ValidateParamHolidayId } from '../holidays/dto/holidays.validate';

@ApiTags('Holidays')
@Controller('holidays')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiBearerAuth('access-token')

export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  @ApiResponseSuccess({ type: [HolidayResponseDto] })
  @ApiResponseError([
    {
      code: '0201',
      message: errorMessage['0201'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0202',
      message: errorMessage['0202'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0203',
      message: errorMessage['0203'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0204',
      message: errorMessage['0204'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0205',
      message: errorMessage['0205'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_HOLIDAY] })
  async findAll(): Promise<ResponseObject<HolidayResponseDto[]>> {
    const holidays = await this.holidayService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: holidays,
    };
  }

  @Get(':id')
  @ApiResponseSuccess({ type: HolidayResponseDto })
  @ApiResponseError([
    {
      code: '0201',
      message: errorMessage['0201'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0202',
      message: errorMessage['0202'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0203',
      message: errorMessage['0203'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0204',
      message: errorMessage['0204'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0205',
      message: errorMessage['0205'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_HOLIDAY] })
  async findOne(@Param() param: ValidateParamHolidayId): Promise<ResponseObject<HolidayResponseDto>> {
    const holiday = await this.holidayService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: holiday,
    };
  }

  @Post()
  @ApiResponseSuccess({ type: HolidayResponseDto })
  @ApiResponseError([
    {
      code: '0201',
      message: errorMessage['0201'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0202',
      message: errorMessage['0202'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0203',
      message: errorMessage['0203'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0204',
      message: errorMessage['0204'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0205',
      message: errorMessage['0205'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_HOLIDAY] })
  @ApiCreatedResponse({ type: HolidayResponseDto })
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<ResponseObject<HolidayResponseDto>> {
    const holiday = await this.holidayService.create(createHolidayDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: holiday,
    };
  }

  @Put(':id')
  @ApiResponseSuccess({ type: HolidayResponseDto })
  @ApiResponseError([
    {
      code: '0201',
      message: errorMessage['0201'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0202',
      message: errorMessage['0202'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0203',
      message: errorMessage['0203'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0204',
      message: errorMessage['0204'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0205',
      message: errorMessage['0205'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_HOLIDAY] })
  @ApiOkResponse({ type: HolidayResponseDto })
  async update(
    @Param() param: ValidateParamHolidayId,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ): Promise<ResponseObject<HolidayResponseDto>> {
    const holiday = await this.holidayService.update(param.id, updateHolidayDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: holiday,
    };
  }

  @Delete(':id')
  @ApiResponseSuccess({ type: HolidayResponseDto })
  @ApiResponseError([
    {
      code: '0201',
      message: errorMessage['0201'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0202',
      message: errorMessage['0202'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0203',
      message: errorMessage['0203'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0204',
      message: errorMessage['0204'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0205',
      message: errorMessage['0205'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_HOLIDAY] })
  @ApiOkResponse({ type: HolidayResponseDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param() param: ValidateParamHolidayId): Promise<void> {
    await this.holidayService.softDelete(param.id);
  }
}
