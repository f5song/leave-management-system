import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, UsePipes, ValidationPipe, Req, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FacilityRequestsService } from './users-facility-requests.service';
import { FacilityRequestResponseDto } from './respones/users-facility-requests.repones.dto';
import { CreateFacilityRequestDto } from './dto/create.users-facility-requests.dto';
import { UpdateFacilityRequestDto } from './dto/update.users-facility-requests.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { ERole } from '@src/common/constants/roles.enum';
import { EPermission } from '@src/common/constants/permission.enum';
import { ValidateParamUsersFacilityRequestId } from './dto/users-facility-requests.validate';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { HttpStatus } from '@nestjs/common';
import { RequestWithUser } from '../../common/interfaces/request-with-user';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';
import { EFacilityStatus } from '@src/common/constants/facility-status.enum';

@ApiTags('Users Facility Requests')
@Controller('users-facility-requests')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)

export class FacilityRequestsController {
  constructor(private readonly facilityRequestsService: FacilityRequestsService) { }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_FACILITY_REQUEST] })
  @Post()
  async create(@Body() dto: CreateFacilityRequestDto,
    @Req() req: RequestWithUser): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.create(req.user.id, dto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiOkResponse({ type: [FacilityRequestResponseDto] })
  @Get()
  async findAll(): Promise<ResponseObject<FacilityRequestResponseDto[]>> {
    const facilityRequests = await this.facilityRequestsService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequests,
    };
  }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  @Get(':id')
  async findOne(@Param() param: ValidateParamUsersFacilityRequestId): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  @Put(':id')
  async update(@Param() param: ValidateParamUsersFacilityRequestId, @Body() dto: UpdateFacilityRequestDto): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.update(param.id, dto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  @ApiParam({ name: 'id', type: 'string', description: 'Item Request ID' })
  @ApiParam({ name: 'status', enum: EFacilityStatus, description: 'New status' })
  @Patch('/:id/:status')
  async updateStatus(@Param('id') id: string,
    @Param('status') status: EFacilityStatus,
    @Req() req: RequestWithUser,
  ): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.updateStatus(id, status, req.user.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }

  @ApiResponseSuccess({
    type: FacilityRequestResponseDto,
  })
  @ApiResponseError([
    {
      code: '0801',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0802',
      message: 'Facility request name already exists',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0803',
      message: 'Facility request name must be between 2 and 100 characters',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0804',
      message: 'Cannot delete facility request that has users',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0805',
      message: 'Invalid facility request ID',
      statusCode: HttpStatus.BAD_REQUEST,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_FACILITY_REQUEST] })
  @ApiOkResponse({ type: FacilityRequestResponseDto })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseObject<FacilityRequestResponseDto>> {
    const facilityRequest = await this.facilityRequestsService.softDelete(id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: facilityRequest,
    };
  }
}
