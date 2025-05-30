import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FacilityRequestsService } from './users-facility-requests.service';
import { CreateFacilityRequestDto, UpdateFacilityRequestDto, FacilityRequestResponseDto } from './users-facility-requests.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users Facility Requests')
@UseGuards(JwtAuthGuard)
@Controller('users-facility-requests')
export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: FacilityRequestResponseDto })
  async create(@Body() dto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.create(dto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  async findAll(): Promise<FacilityRequestResponseDto[]> {
    return this.facilityRequestsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async remove(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.softDelete(id);
  }
}
