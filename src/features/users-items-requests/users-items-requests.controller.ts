import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request, HttpStatus, Req, Put } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { ItemRequestResponseDto } from './respones/users-items-requests.respones.dto';
import { CreateItemRequestDto } from './dto/create.users-items-requests.dto';
import { UpdateItemRequestDto } from './dto/update.users-items-requests.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '@src/common/decorators/roles-permission.decorator';
import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ValidateParamUsersItemRequestId } from './dto/users-items-requests.validate';
import { RequestWithUser } from '@src/common/interfaces/request-with-user';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { ValidateParamUserId } from '../users/dto/users.validate';
import { EItemRequestStatus } from '@src/common/constants/item-request-status.enum';

@ApiTags('Users Items Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-items-requests')
@ApiBearerAuth('access-token')
export class UsersItemsRequestsController {
  constructor(private readonly usersItemsRequestsService: UsersItemsRequestsService) { }

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
  @Get()
  async findAll(): Promise<ResponseObject<ItemRequestResponseDto[]>> {
    const itemRequests = await this.usersItemsRequestsService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: itemRequests,
    };
  }

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
  @Get('pending')
  async findAllPending(): Promise<ResponseObject<ItemRequestResponseDto[]>> {
    const itemRequests = await this.usersItemsRequestsService.findAllPending();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: itemRequests,
    };
  }

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
  @Get(':id')
  async findOne(@Param() param: ValidateParamUsersItemRequestId): Promise<ResponseObject<ItemRequestResponseDto>> {
    const itemRequest = await this.usersItemsRequestsService.findOneDto(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: itemRequest,
    };
  }

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
  @Get('user/:userId')
  async findAllByUser(
    @Req() req: RequestWithUser,
    @Param() param: ValidateParamUserId): Promise<ResponseObject<ItemRequestResponseDto[]>> {
    const itemRequests = await this.usersItemsRequestsService.findAllByUser(req.user.id);
    console.log(param)
    console.log(req.user)
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: itemRequests,
    };
  }

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
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateItemRequestDto): Promise<ResponseObject<ItemRequestResponseDto>> {
    const itemRequest = await this.usersItemsRequestsService.create(dto, req.user.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsService.toUserItemRequestResponseDto(itemRequest),
    };
  }


  // @Patch(':id/approve')
  // @ApiResponseError([
  //   {
  //     code: '0901',
  //     message: errorMessage['0901'],
  //     statusCode: HttpStatus.NOT_FOUND,
  //   },
  //   {
  //     code: '0902',
  //     message: errorMessage['0902'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '0903',
  //     message: errorMessage['0903'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '0904',
  //     message: errorMessage['0904'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '0905',
  //     message: errorMessage['0905'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: '0906',
  //     message: errorMessage['0906'],
  //     statusCode: HttpStatus.BAD_REQUEST,
  //   },
  //   {
  //     code: HttpStatus.INTERNAL_SERVER_ERROR + '',
  //     message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
  //     statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //   }
  // ])
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  // @ApiOkResponse({ type: ItemRequestResponseDto })
  // async approve(@Param() param: ValidateParamUsersItemRequestId, @Request() req: RequestWithUser): Promise<ResponseObject<ItemRequestResponseDto>> {
  //   const itemRequest = await this.usersItemsRequestsService.approve(param.id, req.user.id);
  //   return {
  //     code: HttpStatus.OK,
  //     message: 'SUCCESS',
  //     data: this.usersItemsRequestsService.toUserItemRequestResponseDto(itemRequest),
  //   };
  // }

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
  @RolesPermission({
    role: [ERole.ADMIN],
    permissions: [EPermission.APPROVE_USER_ITEM_REQUEST],
  })
  @ApiParam({ name: 'id', type: 'string', description: 'Item Request ID' })
  @ApiParam({ name: 'status', enum: EItemRequestStatus, description: 'New status' })
  @ApiOkResponse({ type: ItemRequestResponseDto })
  @Patch(':id/:status')
  async updateStatus(
    @Param('id') id: string,
    @Param('status') status: EItemRequestStatus,
    @Req() req: RequestWithUser,
  ): Promise<ResponseObject<ItemRequestResponseDto>> {
    const itemRequest = await this.usersItemsRequestsService.updateStatus(id, {status, approveById: req.user.id});
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsService.toUserItemRequestResponseDto(itemRequest),
    };
  }
  
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
  @Delete(':id')
  async remove(@Param() param: ValidateParamUsersItemRequestId, @Request() req: RequestWithUser): Promise<ResponseObject<ItemRequestResponseDto>> {
    const itemRequest = await this.usersItemsRequestsService.softDelete(param.id, req.user.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsService.toUserItemRequestResponseDto(itemRequest),
    };
  }

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
  @Put(':id')
  async update(
    @Param() param: ValidateParamUsersItemRequestId,
    @Body() body: UpdateItemRequestDto, // <-- เพิ่มตรงนี้
    @Request() req: RequestWithUser
  ): Promise<ResponseObject<ItemRequestResponseDto>> {
    const itemRequest = await this.usersItemsRequestsService.update(param.id, {
      ...body,
      approveById: req.user.id,
    });
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsRequestsService.toUserItemRequestResponseDto(itemRequest),
    };
  }
}