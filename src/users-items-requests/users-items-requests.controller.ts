import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { CreateItemRequestDto, ItemRequestResponseDto } from './item-request.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Users Items Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-items-requests')
export class UsersItemsRequestsController {
  constructor(private readonly usersItemsRequestsService: UsersItemsRequestsService) {}

  @Post()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: ItemRequestResponseDto })
  async create(@Body() dto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.create(dto);
  }

  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllPending();
  }

  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemRequestResponseDto] })
  async findAllByUser(@Param('userId') userId: string): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllByUser(userId);
  }

  @Patch(':id/approve')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async approve(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.approve(id, req.user.id);
  }

  @Patch(':id/reject')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async reject(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.reject(id, req.user.id);
  }

  @Delete(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async remove(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.softDelete(id);
  }
}
