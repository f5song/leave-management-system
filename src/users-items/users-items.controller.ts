import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersItemsService } from './users-items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemEntity } from '../database/entity/users-items.entity';
import { ItemRequestEntity } from '../database/entity/users-items-request.entity';
import { ItemRequestStatus } from '../constants/item-request-status.enum';

@Controller('users-items')
@UseGuards(JwtAuthGuard)
export class UsersItemsController {
  constructor(private readonly usersItemsService: UsersItemsService) {}

  // แสดงรายการอุปกรณ์ทั้งหมด
  @Get()
  async findAll(): Promise<ItemEntity[]> {
    return this.usersItemsService.findAll();
  }

  // แสดงรายการอุปกรณ์ตาม ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ItemEntity> {
    return this.usersItemsService.findOne(id);
  }

  // สร้างรายการอุปกรณ์ใหม่
  @Post()
  async create(@Body() item: Partial<ItemEntity>): Promise<ItemEntity> {
    return this.usersItemsService.create(item);
  }

  // อัพเดทรายการอุปกรณ์
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() item: Partial<ItemEntity>,
  ): Promise<ItemEntity> {
    return this.usersItemsService.update(id, item);
  }

  // ลบรายการอุปกรณ์
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersItemsService.remove(id);
  }

  // สร้างคำร้องขออุปกรณ์
  @Post('requests')
  async createRequest(
    @Req() req,
    @Body() request: Partial<ItemRequestEntity>,
  ): Promise<ItemRequestEntity> {
    request.requestedBy = req.user;
    return this.usersItemsService.createRequest(request);
  }

  // อัพเดทสถานะคำร้องขอ
  @Put('requests/:requestId/approve')
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() body: { status: ItemRequestStatus },
    @Req() req,
  ): Promise<ItemRequestEntity> {
    return this.usersItemsService.updateRequestStatus(
      requestId,
      body.status,
      req.user,
    );
  }

  // แสดงรายการคำร้องขอทั้งหมด
  @Get('requests')
  async findRequests(): Promise<ItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }

  // แสดงรายการคำร้องขอของผู้ใช้
  @Get('requests/user')
  async findUserRequests(@Req() req): Promise<ItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }
}
