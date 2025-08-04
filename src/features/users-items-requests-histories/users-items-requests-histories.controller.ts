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
import { ResponseObject } from '@src/common/dto/common-response.dto';

@ApiTags('Users Items Requests Histories')
@Controller('users-items-requests-histories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class UsersItemsRequestsHistoriesController {
  constructor(private readonly usersItemsRequestsHistoriesService: UsersItemsRequestsHistoriesService) {}

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
  @Get()
  async findAll(): Promise<ResponseObject<ItemsRequestsHistoryResponseDto[]>> {
    const history = await this.usersItemsRequestsHistoriesService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: history,
    };
  }

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
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @Get(':id')
  async findOne(@Param() param: ValidateParamUsersItemRequestId): Promise<ResponseObject<ItemsRequestsHistoryResponseDto>> {
    const history = await this.usersItemsRequestsHistoriesService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsHistoriesService.toUserItemRequestHistoryResponseDto(history),
    };
  }

  // @Post()
  // @ApiResponseError([
  //   {
  //     code: '1101',
  //     message: errorMessage['1101'],
  //     statusCode: HttpStatus.NOT_FOUND,
  //   },
  //   {
  //     code: '1102',
  //     message: errorMessage['1102'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '1103',
  //     message: errorMessage['1103'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '1104',
  //     message: errorMessage['1104'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '1105',
  //     message: errorMessage['1105'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '1106',
  //     message: errorMessage['1106'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: HttpStatus.INTERNAL_SERVER_ERROR + '',
  //     message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
  //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //   }
  // ])
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM_REQUEST] })
  // @ApiCreatedResponse({ type: ItemsRequestsHistoryResponseDto })
  // async create(@Body() createDto: CreateItemsRequestsHistoryDto) {
  //   const history = await this.usersItemsRequestsHistoriesService.create(createDto);
  //   return {
  //     code: HttpStatus.OK,
  //     message: 'SUCCESS',
  //     data: this.usersItemsRequestsHistoriesService.toUserItemRequestHistoryResponseDto(history),
  //   };
  // }

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
  @Put(':id')
  async update(
    @Param() param: ValidateParamUsersItemRequestId,
    @Body() updateDto: UpdateItemsRequestsHistoryDto,
  ): Promise<ResponseObject<ItemsRequestsHistoryResponseDto>> {
    const history = await this.usersItemsRequestsHistoriesService.update(param.id, updateDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsHistoriesService.toUserItemRequestHistoryResponseDto(history),
    };
  }

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
  @Delete(':id')
  async delete(@Param() param: ValidateParamUsersItemRequestId): Promise<ResponseObject<void>> {
    await this.usersItemsRequestsHistoriesService.delete(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: null,
    };
  }
}
