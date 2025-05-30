import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';
import { ItemRequestStatus } from '../constants/item-request-status.enum';
import { UserItemResponseDto } from './users-items.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Users Items')
@Controller('users-items')
@UseGuards(JwtAuthGuard)
export class UsersItemsController {
  constructor(private readonly usersItemsService: UsersItemsService) { }

  // แสดงรายการอุปกรณ์ทั้งหมด
  @Get()
  @ApiOkResponse({ type: [UserItemResponseDto] })
  async findAll(): Promise<UserItemResponseDto[]> {
    const items = await this.usersItemsService.findAll();
    return items.map(item => this.usersItemsService.toUserItemResponseDto(item));
  }

  // แสดงรายการอุปกรณ์ตาม ID
  @Get(':id')
  @ApiOkResponse({ type: UserItemResponseDto })
  async findOne(@Param('id') id: string): Promise<UserItemResponseDto> {
    const item = await this.usersItemsService.findOne(id);
    return this.usersItemsService.toUserItemResponseDto(item);
  }

  // สร้างรายการอุปกรณ์ใหม่
  @Post()
  @ApiCreatedResponse({ type: UserItemResponseDto })
  async create(@Body() item: Partial<UsersItemEntity>): Promise<UserItemResponseDto> {
    const createdItem = await this.usersItemsService.create(item);
    return this.usersItemsService.toUserItemResponseDto(createdItem);
  }

  // อัพเดทรายการอุปกรณ์
  @Put(':id')
  @ApiOkResponse({ type: UserItemResponseDto })
  async update(
    @Param('id') id: string,
    @Body() item: Partial<UsersItemEntity>,
  ): Promise<UserItemResponseDto> {
    const updatedItem = await this.usersItemsService.update(id, item);
    return this.usersItemsService.toUserItemResponseDto(updatedItem);
  }

  // ลบรายการอุปกรณ์
  @Delete(':id')
  @ApiOkResponse({ type: UserItemResponseDto })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersItemsService.remove(id);
  }

  // สร้างคำร้องขออุปกรณ์
  @Post('requests')
  @ApiCreatedResponse({ type: UsersItemRequestEntity })
  async createRequest(
    @Req() req,
    @Body() request: Partial<UsersItemRequestEntity>,
  ): Promise<UsersItemRequestEntity> {
    request.requestedBy = req.user;
    return this.usersItemsService.createRequest(request);
  }

  // อัพเดทสถานะคำร้องขอ
  @Put('requests/:requestId/approve')
  @ApiOkResponse({ type: UsersItemRequestEntity })
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() body: { status: ItemRequestStatus },
    @Req() req,
  ): Promise<UsersItemRequestEntity> {
    return this.usersItemsService.updateRequestStatus(
      requestId,
      body.status,
      req.user,
    );
  }

  // แสดงรายการคำร้องขอทั้งหมด
  @Get('requests')
  @ApiOkResponse({ type: [UsersItemRequestEntity] })
  async findRequests(): Promise<UsersItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }

  // แสดงรายการคำร้องขอของผู้ใช้
  @Get('requests/user')
  @ApiOkResponse({ type: [UsersItemRequestEntity] })
  async findUserRequests(@Req() req): Promise<UsersItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }
}
