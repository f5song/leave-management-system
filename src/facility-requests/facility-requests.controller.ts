import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FacilityRequestsService } from './facility-requests.service';
import { CreateFacilityRequestDto, UpdateFacilityRequestDto, FacilityRequestResponseDto } from './facility-request.dto';

@UseGuards(JwtAuthGuard)
@Controller('facility-requests')
export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  async create(@Body() dto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.create(dto);
  }

  @Get()
  async findAll(): Promise<FacilityRequestResponseDto[]> {
    return this.facilityRequestsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.softDelete(id);
  }
}
