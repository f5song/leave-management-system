import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersItemsService } from './users-items.service';
import { UsersItemEntity } from '../../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { UserItemResponseDto } from './dto/users-items.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { CreateItemDto } from './dto/create.users-items.dto';
import { UpdateItemDto } from './dto/update.users-items.dto';
import { ItemRequestResponseDto } from '../users-items-requests/dto/users-items-requests.respones.dto';

@ApiTags('Users Items')
@Controller('users-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersItemsController {
  constructor(private readonly usersItemsService: UsersItemsService) { }

  // แสดงรายการอุปกรณ์ทั้งหมด
  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UserItemResponseDto] })
  async findAll(): Promise<UserItemResponseDto[]> {
    const items = await this.usersItemsService.findAll();
    return items.map(item => this.usersItemsService.toUserItemResponseDto(item));
  }

  // แสดงรายการอุปกรณ์ตาม ID
  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  async findOne(@Param('id') id: string): Promise<UserItemResponseDto> {
    const item = await this.usersItemsService.findOne(id);
    return this.usersItemsService.toUserItemResponseDto(item);
  }

  // สร้างรายการอุปกรณ์ใหม่
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: UserItemResponseDto })
  async create(@Body() item: CreateItemDto): Promise<UserItemResponseDto> {
    return this.usersItemsService.create(item);
  }

  // อัพเดทรายการอุปกรณ์
  @Put(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  async update(
    @Param('id') id: string,
    @Body() item: UpdateItemDto,
  ): Promise<UserItemResponseDto> {
    return this.usersItemsService.update(id, item); // ✅ ไม่ต้องแปลงซ้ำ
  }


  // ลบรายการอุปกรณ์
  @Delete(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserItemResponseDto })
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersItemsService.remove(id);
  }

  // สร้างคำร้องขออุปกรณ์
  @Post('requests')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: ItemRequestResponseDto })
  async createRequest(
    @Req() req,
    @Body() request: Partial<UsersItemRequestEntity>,
  ): Promise<ItemRequestResponseDto> {
    request.requestedBy = req.user;
    return this.usersItemsService.createRequest(request);
  }

  // อัพเดทสถานะคำร้องขอ
  @Put('requests/:requestId/approve')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemRequestResponseDto })
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() body: { status: EItemRequestStatus },
    @Req() req,
  ): Promise<ItemRequestResponseDto> {
    return this.usersItemsService.updateRequestStatus(
      requestId,
      body.status,
      req.user,
    );
  }


  // แสดงรายการคำร้องขอทั้งหมด
  @Get('requests')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UsersItemRequestEntity] })
  async findRequests(): Promise<UsersItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }

  // แสดงรายการคำร้องขอของผู้ใช้
  @Get('requests/user')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UsersItemRequestEntity] })
  async findUserRequests(@Req() req): Promise<UsersItemRequestEntity[]> {
    return this.usersItemsService.findAllRequests();
  }
}
