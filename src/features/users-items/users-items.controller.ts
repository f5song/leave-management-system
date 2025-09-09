import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe, Req, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { EStatus } from '@common/constants/status.enum';
import { UserItemResponseDto } from './respones/users-items.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateItemDto } from './dto/create.users-items.dto';
import { UpdateItemDto } from './dto/update.users-items.dto';
import { ItemRequestResponseDto } from '../users-items-requests/respones/users-items-requests.respones.dto';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { EPermission } from '@common/constants/permission.enum';
import { ERole } from '@common/constants/roles.enum';
import { ResponseObject } from '@common/dto/common-response.dto';
import { RequestWithUser } from '@src/common/interfaces/request-with-user';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { ValidateParamUserId } from '../users/dto/users.validate';
import { ValidateParamUsersItemId } from './dto/users-items.validate';
import { ValidateParamUsersItemRequestId } from '../users-items-requests/dto/users-items-requests.validate';


@ApiTags('Users Items')
@Controller('users-items')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsersItemsController {
  constructor(private readonly usersItemsService: UsersItemsService) { }

  @ApiResponseSuccess({
    type: [UserItemResponseDto],
  })
  @ApiResponseError([
    {
      code: '0901',
      message: 'Item not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0902',
      message: 'Item name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: 'Item name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: 'Cannot delete item that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: 'Invalid item ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UserItemResponseDto] })
  @Get()
  async findAll(): Promise<ResponseObject<UserItemResponseDto[]>> {
    const items = await this.usersItemsService.findAll();

    console.log('Items fetched:', items.length);
    items.forEach((item, index) => {
      console.log(`Response DTO index: ${index}, id: ${item.id}`);
    });
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: items.map(item => this.usersItemsService.toUserItemResponseDto(item)),
    };
  }

  @ApiResponseSuccess({
    type: UserItemResponseDto,
  })
  @ApiResponseError([
    {
      code: '0901',
      message: 'Item not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0902',
      message: 'Item name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: 'Item name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: 'Cannot delete item that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: 'Invalid item ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseObject<UserItemResponseDto>> {
    const item = await this.usersItemsService.findOne(id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsService.toUserItemResponseDto(item),
    };
  }

  @ApiResponseSuccess({
    type: UserItemResponseDto,
  })
  @ApiResponseError([
    {
      code: '0901',
      message: 'Item not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0902',
      message: 'Item name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: 'Item name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: 'Cannot delete item that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: 'Invalid item ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM] })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: UserItemResponseDto })
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() item: CreateItemDto): Promise<ResponseObject<UserItemResponseDto>> {
    const createdItem = await this.usersItemsService.create(req.user.id, item);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsService.toUserItemResponseDto(createdItem),
    };
  }

  @ApiResponseSuccess({
    type: UserItemResponseDto,
  })
  @ApiResponseError([
    {
      code: '0901',
      message: 'Item not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0902',
      message: 'Item name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: 'Item name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: 'Cannot delete item that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: 'Invalid item ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_USER_ITEM] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  @Put(':id')
  async update(
    @Param() param: ValidateParamUsersItemRequestId,
    @Body() item: UpdateItemDto,
  ): Promise<ResponseObject<UserItemResponseDto>> {
    const updatedItem = await this.usersItemsService.update(param.id, item);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.usersItemsService.toUserItemResponseDto(updatedItem),
    };
  }

  @ApiResponseSuccess({
    type: UserItemResponseDto,
  })
  @ApiResponseError([
    {
      code: '0901',
      message: 'Item not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0902',
      message: 'Item name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0903',
      message: 'Item name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0904',
      message: 'Cannot delete item that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0905',
      message: 'Invalid item ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_USER_ITEM] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  @Delete(':id')
  async remove(@Param() param: ValidateParamUsersItemRequestId): Promise<void> {
    return this.usersItemsService.remove(param.id);
  }

  // สร้างคำร้องขออุปกรณ์
  // @Post('requests')
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM_REQUEST] })
  // @ApiBearerAuth('access-token')
  // @ApiCreatedResponse({ type: ItemRequestResponseDto })
  // async createRequest(
  //   @Req() req: RequestWithUser,
  //   @Body() request: Partial<UsersItemRequestEntity>,
  // ): Promise<ItemRequestResponseDto> {
  //   request.requestedBy.id = req.user.id;
  //   return this.usersItemsService.createRequest(request);
  // }

  // อัพเดทสถานะคำร้องขอ
  // @Put('requests/:requestId/approve')
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  // @ApiBearerAuth('access-token')
  // @ApiOkResponse({ type: ItemRequestResponseDto })
  // async approveRequest(
  //   @Param('requestId') requestId: string,
  //   @Body() body: { status: EItemRequestStatus },
  //   @Req() req: RequestWithUser,
  // ): Promise<ItemRequestResponseDto> {
  //   return this.usersItemsService.updateRequestStatus(
  //     requestId,
  //     body.status,
  //     req.user.id,
  //   );
  // }


  // แสดงรายการคำร้องขอทั้งหมด
  // @Get('requests')
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  // @ApiBearerAuth('access-token')
  // @ApiOkResponse({ type: [UsersItemRequestEntity] })
  // async findRequests(): Promise<UsersItemRequestEntity[]> {
  //   return this.usersItemsService.findAllRequests();
  // }

  // // แสดงรายการคำร้องขอของผู้ใช้
  // @Get('requests/user')
  // @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  // @ApiBearerAuth('access-token')
  // @ApiOkResponse({ type: [UsersItemRequestEntity] })
  // async findUserRequests(@Req() req: RequestWithUser): Promise<UsersItemRequestEntity[]> {
  //   return this.usersItemsService.findAllRequests();
  // }
}
