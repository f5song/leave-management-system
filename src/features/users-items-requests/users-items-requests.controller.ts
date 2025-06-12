import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { ItemRequestResponseDto } from './respones/users-items-requests.respones.dto';
import { CreateItemRequestDto } from './dto/create.users-items-requests.dto';
import { UpdateItemRequestDto } from './dto/update.users-items-requests.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '@src/common/decorators/roles-permission.decorator';
import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ValidateParamUsersItemRequestId } from './dto/users-items-requests.validate';

@ApiTags('Users Items Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-items-requests')
@ApiBearerAuth('access-token')
export class UsersItemsRequestsController {
  constructor(private readonly usersItemsRequestsService: UsersItemsRequestsService) {}

  @Post()
   @ApiResponseError([
      {
        code: '0901',
        message: errorMessage['0901'],
        statusCode: HttpStatus.NOT_FOUND,
      },
      {
        code: '0902',
        message: errorMessage['0902'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0903',
        message: errorMessage['0903'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0904',
        message: errorMessage['0904'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0905',
        message: errorMessage['0905'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: '0906',
        message: errorMessage['0906'],
        statusCode: HttpStatus.BAD_REQUEST,
      },
      {
        code: HttpStatus.INTERNAL_SERVER_ERROR + '',
        message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    ])
  
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM_REQUEST] })
  @ApiCreatedResponse({ type: ItemRequestResponseDto })
  async create(@Body() dto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.create(dto);
  }

  @Get()
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllPending();
  }

  @Get(':id')
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async findOne(@Param() param: ValidateParamUsersItemRequestId): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.findOneDto(param.id);
  }

  @Get('user/:userId')
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllByUser(@Param() param: ValidateParamUsersItemRequestId): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllByUser(param.id);
  }

  @Patch(':id/approve')
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async approve(@Param() param: ValidateParamUsersItemRequestId, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.approve(param.id, req.user.id);
  }

  @Patch(':id/reject')
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async reject(@Param() param: ValidateParamUsersItemRequestId, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.reject(param.id, req.user.id);
  }

  @Delete(':id')
  @ApiResponseError([
    {
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0902',
      message: errorMessage['0902'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: errorMessage['0903'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: errorMessage['0904'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: errorMessage['0905'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0906',
      message: errorMessage['0906'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_USER_ITEM_REQUEST] })
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async remove(@Param() param: ValidateParamUsersItemRequestId): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.softDelete(param.id);
  }
}
