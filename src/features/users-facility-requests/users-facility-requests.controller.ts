import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FacilityRequestsService } from './users-facility-requests.service';
import { FacilityRequestResponseDto } from './respones/users-facility-requests.repones.dto';
import { CreateFacilityRequestDto } from './dto/create.users-facility-requests.dto';
import { UpdateFacilityRequestDto } from './dto/update.users-facility-requests.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { ERole } from '@src/common/constants/roles.enum';
import { EPermission } from '@src/common/constants/permission.enum';

@ApiTags('Users Facility Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users-facility-requests')
export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_FACILITY_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: FacilityRequestResponseDto })
  async create(@Body() dto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.create(dto);
  }

  @Get()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  async findAll(): Promise<FacilityRequestResponseDto[]> {
    return this.facilityRequestsService.findAll();
  }

  @Get(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async findOne(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.findOne(id);
  }

  @Patch(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_FACILITY_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.update(id, dto);
  }

  @Delete(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_FACILITY_REQUEST] })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async remove(@Param('id') id: string): Promise<FacilityRequestResponseDto> {
    return this.facilityRequestsService.softDelete(id);
  }
}
