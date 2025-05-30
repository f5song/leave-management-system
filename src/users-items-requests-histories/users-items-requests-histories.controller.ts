import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersItemsRequestsHistoriesService } from './users-items-requests-histories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsRequestsHistoryResponseDto } from './items-requests-history.dto';

@ApiTags('Users Items Requests Histories')
@Controller('users-items-requests-histories')
@UseGuards(JwtAuthGuard)
export class UsersItemsRequestsHistoriesController {
  constructor(private readonly usersItemsRequestsHistoriesService: UsersItemsRequestsHistoriesService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemsRequestsHistoryResponseDto] })
  findAll() {
    return this.usersItemsRequestsHistoriesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersItemsRequestsHistoriesService.findOne(id);
  }
}
