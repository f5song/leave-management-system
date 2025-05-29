import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersItemsRequestsService } from './users-items-requests.service';
import { CreateItemRequestDto, ItemRequestResponseDto } from './item-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('users-items-requests')
export class UsersItemsRequestsController {
  constructor(private readonly usersItemsRequestsService: UsersItemsRequestsService) {}

  @Post()
  async create(@Body() dto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.create(dto);
  }

  @Get()
  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllPending();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.findOne(id);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<ItemRequestResponseDto[]> {
    return this.usersItemsRequestsService.findAllByUser(userId);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.approve(id, req.user.id);
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string, @Request() req): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.reject(id, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ItemRequestResponseDto> {
    return this.usersItemsRequestsService.softDelete(id);
  }
}
