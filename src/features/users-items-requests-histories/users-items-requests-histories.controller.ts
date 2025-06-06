import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersItemsRequestsHistoriesService } from './users-items-requests-histories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsRequestsHistoryResponseDto } from './dto/users-items-requests-histories.respones.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';

@ApiTags('Users Items Requests Histories')
@Controller('users-items-requests-histories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersItemsRequestsHistoriesController {
  constructor(private readonly usersItemsRequestsHistoriesService: UsersItemsRequestsHistoriesService) {}

  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [ItemsRequestsHistoryResponseDto] })
  findAll() {
    return this.usersItemsRequestsHistoriesService.findAll();
  }

  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: ItemsRequestsHistoryResponseDto })
  findOne(@Param('id') id: string) {
    return this.usersItemsRequestsHistoriesService.findOne(id);
  }
}
