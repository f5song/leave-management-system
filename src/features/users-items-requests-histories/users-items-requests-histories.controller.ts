import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersItemsRequestsHistoriesService } from './users-items-requests-histories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { ItemsRequestsHistoryResponseDto } from './dto/users-items-requests-histories.respones.dto';
import { CreateItemsRequestsHistoryDto } from './dto/create.users-items-requests-histories.dto';
import { UpdateItemsRequestsHistoryDto } from './dto/update.users-items-requests-histories.dto';

@ApiTags('Users Items Requests Histories')
@Controller('users-items-requests-histories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersItemsRequestsHistoriesController {
  constructor(private readonly usersItemsRequestsHistoriesService: UsersItemsRequestsHistoriesService) {}

  @Get()
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemsRequestsHistoryResponseDto] })
  findAll() {
    return this.usersItemsRequestsHistoriesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  @ApiNotFoundResponse({ description: 'History not found' })
  findOne(@Param('id') id: string) {
    return this.usersItemsRequestsHistoriesService.findOne(id);
  }

  @Post()
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: ItemsRequestsHistoryResponseDto })
  async create(@Body() createDto: CreateItemsRequestsHistoryDto) {
    return this.usersItemsRequestsHistoriesService.create(createDto);
  }

  @Put(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  @ApiNotFoundResponse({ description: 'History not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateItemsRequestsHistoryDto,
  ) {
    return this.usersItemsRequestsHistoriesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiNotFoundResponse({ description: 'History not found' })
  async delete(@Param('id') id: string) {
    return this.usersItemsRequestsHistoriesService.delete(id);
  }
}
