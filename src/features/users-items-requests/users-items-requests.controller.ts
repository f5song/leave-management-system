import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
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

@ApiTags('Users Items Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-items-requests')
export class UsersItemsRequestsController {
  constructor(private readonly usersItemsRequestsService: UsersItemsRequestsService) {}

  @Post()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: ItemRequestResponseDto })
  async create(@Body() dto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.create(dto);
  }

  @Get()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllPending();
  }

  @Get(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.findOneDto(id);
  }

  @Get('user/:userId')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllByUser(@Param('userId') userId: string): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllByUser(userId);
  }

  @Patch(':id/approve')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async approve(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.approve(id, req.user.id);
  }

  @Patch(':id/reject')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.APPROVE_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async reject(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.reject(id, req.user.id);
  }

  @Delete(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_USER_ITEM_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async remove(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.softDelete(id);
  }
}
