import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LeaveTypeService } from './leave-type.service';
import { LeaveTypeResponseDto } from './respones/leave-types.respones.dto';
import { CreateLeaveTypeDto } from './dto/create.leave-types.dto';
import { UpdateLeaveTypeDto } from './dto/update.leave-types.dto';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesPermission } from '@src/common/decorators/roles-permission.decorator';
import { EPermission } from '@common/constants/permission.enum';
import { ERole } from '@common/constants/roles.enum';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { HttpStatus } from '@nestjs/common';
import { ValidateParamLeaveTypeId } from './dto/leave-types.validate';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';

@ApiTags('Leave Types')
@Controller('leave-types')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_LEAVE_TYPE] })
  @ApiCreatedResponse({ type: LeaveTypeResponseDto })
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const leaveType = await this.leaveTypeService.create(createLeaveTypeDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaveType,
    };
  }

  @Get()
  @ApiResponseSuccess({ type: [LeaveTypeResponseDto] })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_LEAVE_TYPE] })
  @ApiOkResponse({ type: [LeaveTypeResponseDto] })
  async findAll(): Promise<ResponseObject<LeaveTypeResponseDto[]>> {
    const leaveTypes = await this.leaveTypeService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaveTypes,
    };
  }

  @Get(':id')
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async findOne(@Param() param: ValidateParamLeaveTypeId): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const leaveType = await this.leaveTypeService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaveType,
    };
  }

  @Put(':id')
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async update(
    @Param() param: ValidateParamLeaveTypeId,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto
  ): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const updatedLeaveType = await this.leaveTypeService.update(param.id, updateLeaveTypeDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: updatedLeaveType,
    };
  }

  @Patch(':id')
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async partialUpdate(@Param() param: ValidateParamLeaveTypeId, @Body() data: Partial<UpdateLeaveTypeDto>): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const updatedLeaveType = await this.leaveTypeService.partialUpdate(param.id, data);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: updatedLeaveType,
    };
  }
  
  @Delete(':id')
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async remove(@Param() param: ValidateParamLeaveTypeId): Promise<void> {
    return this.leaveTypeService.softDelete(param.id);
  }

  @Post(':id')
  @ApiResponseSuccess({ type: LeaveTypeResponseDto })
  @ApiResponseError([
    {
      code: '0301',
      message: errorMessage['0301'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0302',
      message: errorMessage['0302'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0303',
      message: errorMessage['0303'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0304',
      message: errorMessage['0304'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0305',
      message: errorMessage['0305'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async restore(@Param() param: ValidateParamLeaveTypeId): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const restoredLeaveType = await this.leaveTypeService.restore(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: restoredLeaveType,
    };
  }
}
