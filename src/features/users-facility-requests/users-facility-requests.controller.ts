import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FacilityRequestsService } from './users-facility-requests.service';
import { FacilityRequestResponseDto } from './dto/users-facility-requests.repones.dto';
import { CreateFacilityRequestDto } from './dto/create.users-facility-requests.dto';
import { UpdateFacilityRequestDto } from './dto/update.users-facility-requests.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles-permission.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Users Facility Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-facility-requests')
export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: FacilityRequestResponseDto })
  async create(@Body() dto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.create(dto);
  }

  @Get()
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  async findAll(): Promise<FacilityRequestResponseDto[]> {
    return this.facilityRequestsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async remove(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.softDelete(id);
  }
}
