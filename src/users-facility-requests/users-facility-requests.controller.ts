import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FacilityRequestsService } from './users-facility-requests.service';
import { CreateFacilityRequestDto, UpdateFacilityRequestDto, FacilityRequestResponseDto } from './users-facility-requests.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@ApiTags('Users Facility Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-facility-requests')
export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: FacilityRequestResponseDto })
  async create(@Body() dto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.create(dto);
  }

  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  async findAll(): Promise<FacilityRequestResponseDto[]> {
    return this.facilityRequestsService.findAll();
  }

  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async remove(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.softDelete(id);
  }
}
