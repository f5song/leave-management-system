import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { ValidateParamUsersFacilityRequestId } from './dto/users-facility-requests.validate';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Users Facility Requests')
@Controller('users-facility-requests')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)

export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) {}

  @Post()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_FACILITY_REQUEST] })
  @ApiCreatedResponse({ type: FacilityRequestResponseDto })
  async create(@Body() dto: CreateFacilityRequestDto): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.create(dto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @Get()
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  async findAll(): Promise<ResponseObject<FacilityRequestResponseDto[]>> {
    const facilityRequests = await this.facilityRequestsService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequests,
    };
  }

  @Get(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async findOne(@Param() param: ValidateParamUsersFacilityRequestId): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @Patch(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async update(@Param() param: ValidateParamUsersFacilityRequestId, @Body() dto: UpdateFacilityRequestDto): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.update(param.id, dto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @Delete(':id')
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  async remove(@Param() param: ValidateParamUsersFacilityRequestId): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.softDelete(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }
}
