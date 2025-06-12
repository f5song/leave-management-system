import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersItemsRequestsHistoriesService } from './users-items-requests-histories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { ItemsRequestsHistoryResponseDto } from './respones/users-items-requests-histories.respones.dto';
import { CreateItemsRequestsHistoryDto } from './dto/create.users-items-requests-histories.dto';
import { UpdateItemsRequestsHistoryDto } from './dto/update.users-items-requests-histories.dto';
import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';
import { ValidateParamUsersItemRequestId } from './dto/users-items-requests-histories.validate';
import { errorMessage } from '@src/common/constants/error-message';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';

@ApiTags('Users Items Requests Histories')
@Controller('users-items-requests-histories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersItemsRequestsHistoriesController {
  constructor(private readonly usersItemsRequestsHistoriesService: UsersItemsRequestsHistoriesService) {}

  @Get()
   @ApiResponseError([
      {
        code: '1101',
        message: errorMessage['1101'],
        statusCode: HttpStatus.NOT_FOUND,
      },
      {
        code: '1102',
        message: errorMessage['1102'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '1103',
        message: errorMessage['1103'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '1104',
        message: errorMessage['1104'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '1105',
        message: errorMessage['1105'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '1106',
        message: errorMessage['1106'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR + '',
        message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: [ItemsRequestsHistoryResponseDto] })
  findAll() {
    return this.usersItemsRequestsHistoriesService.findAll();
  }

  @Get(':id')
  @ApiResponseError([
    {
      code: '1101',
      message: errorMessage['1101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '1102',
      message: errorMessage['1102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1103',
      message: errorMessage['1103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1104',
      message: errorMessage['1104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1105',
      message: errorMessage['1105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1106',
      message: errorMessage['1106'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  @ApiNotFoundResponse({ description: 'History not found' })
  findOne(@Param() param: ValidateParamUsersItemRequestId) {
    return this.usersItemsRequestsHistoriesService.findOne(param.id);
  }

  @Post()
  @ApiResponseError([
    {
      code: '1101',
      message: errorMessage['1101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '1102',
      message: errorMessage['1102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1103',
      message: errorMessage['1103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1104',
      message: errorMessage['1104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1105',
      message: errorMessage['1105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1106',
      message: errorMessage['1106'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM_REQUEST] })
  @ApiCreatedResponse({ type: ItemsRequestsHistoryResponseDto })
  async create(@Body() createDto: CreateItemsRequestsHistoryDto) {
    return this.usersItemsRequestsHistoriesService.create(createDto);
  }

  @Put(':id')
  @ApiResponseError([
    {
      code: '1101',
      message: errorMessage['1101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '1102',
      message: errorMessage['1102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1103',
      message: errorMessage['1103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1104',
      message: errorMessage['1104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1105',
      message: errorMessage['1105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1106',
      message: errorMessage['1106'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  @ApiNotFoundResponse({ description: 'History not found' })
  async update(
    @Param() param: ValidateParamUsersItemRequestId,
    @Body() updateDto: UpdateItemsRequestsHistoryDto,
  ) {
    return this.usersItemsRequestsHistoriesService.update(param.id, updateDto);
  }

  @Delete(':id')
  @ApiResponseError([
    {
      code: '1101',
      message: errorMessage['1101'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '1102',
      message: errorMessage['1102'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1103',
      message: errorMessage['1103'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1104',
      message: errorMessage['1104'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1105',
      message: errorMessage['1105'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '1106',
      message: errorMessage['1106'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_USER_ITEM_REQUEST] })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiNotFoundResponse({ description: 'History not found' })
  async delete(@Param() param: ValidateParamUsersItemRequestId) {
    return this.usersItemsRequestsHistoriesService.delete(param.id);
  }
}
