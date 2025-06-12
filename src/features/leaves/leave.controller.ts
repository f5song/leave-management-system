import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import {
  LeaveResponseDto,
} from './respones/leaves.respones.dto';
import { CreateLeaveDto } from './dto/create.leaves.dto';
import { UpdateLeaveDto } from './dto/update.leaves.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { EPermission } from '@common/constants/permission.enum';
import { ERole } from '@common/constants/roles.enum';
import { ValidateParamLeaveId } from './dto/leaves.validate';
import { ResponseObject } from '@src/common/dto/common-response.dto';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';

@ApiTags('Leaves')
@Controller('leaves')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')

export class LeaveController {
  constructor(private readonly leaveService: LeaveService) { }

  @Get('me')
  @ApiOkResponse({ type: [LeaveResponseDto] })
@ApiResponseError([
  {
    code: '0401',
    message: errorMessage['0401'],
    statusCode: HttpStatus.BAD_REQUEST,
  }, 
  {
    code: '0402',
    message: errorMessage['0402'],
    statusCode: HttpStatus.BAD_REQUEST,
  },
  {
    code: '0403',
    message: errorMessage['0403'],
    statusCode: HttpStatus.BAD_REQUEST,
  },
  {
    code: '0404',
    message: errorMessage['0404'],
    statusCode: HttpStatus.BAD_REQUEST,
  },
  {
    code: '0405',
    message: errorMessage['0405'],
    statusCode: HttpStatus.BAD_REQUEST,
  },
  {
    code: HttpStatus.INTERNAL_SERVER_ERROR + '',
    message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  }
])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_LEAVE] })
  async getMyLeaves(@Param() param: ValidateParamLeaveId): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getMyLeaves(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves.map(leave => this.leaveService.toLeaveResponseDto(leave)),
    };
  }

  @Get()
  @ApiResponseError([
    {
      code: '0401',
      message: errorMessage['0401'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0402',
      message: errorMessage['0402'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0403',
      message: errorMessage['0403'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0404',
      message: errorMessage['0404'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0405',
      message: errorMessage['0405'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_LEAVE] })
  async getAllLeaves(@Param() param: ValidateParamLeaveId): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getAllLeaves(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves.map(leave => this.leaveService.toLeaveResponseDto(leave)),
    };
  }

  @Post()
  @ApiOkResponse({ type: [LeaveResponseDto] })
  @ApiResponseError([
    {
      code: '0401',
      message: errorMessage['0401'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0402',
      message: errorMessage['0402'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0403',
      message: errorMessage['0403'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0404',
      message: errorMessage['0404'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0405',
      message: errorMessage['0405'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.CREATE_LEAVE] })
  @ApiCreatedResponse({ type: LeaveResponseDto })
  async create(
    @Body() dto: CreateLeaveDto,
    @Param() param: ValidateParamLeaveId,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const leave = await this.leaveService.createLeave(dto, param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(leave),
    };
  }


  @Patch(':id/details')
  @ApiOkResponse({ type: [LeaveResponseDto] })
  @ApiResponseError([
    {
      code: '0401',
      message: errorMessage['0401'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0402',
      message: errorMessage['0402'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0403',
      message: errorMessage['0403'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0404',
      message: errorMessage['0404'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0405',
      message: errorMessage['0405'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_LEAVE] })
  @ApiOkResponse({ type: LeaveResponseDto })
  async updateDetails(
    @Param() param: ValidateParamLeaveId,
    @Body() dto: UpdateLeaveDto,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const updatedLeave = await this.leaveService.updateLeaveDetails(param.id, dto, param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(updatedLeave),
    };
  }

  @Patch(':id/status')
  @ApiOkResponse({ type: [LeaveResponseDto] })
  @ApiResponseError([
    {
      code: '0401',
      message: errorMessage['0401'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0402',
      message: errorMessage['0402'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0403',
      message: errorMessage['0403'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0404',
      message: errorMessage['0404'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0405',
      message: errorMessage['0405'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.UPDATE_LEAVE] })
  @ApiOkResponse({ type: LeaveResponseDto })
  async updateStatus(
    @Param() param: ValidateParamLeaveId,
    @Body() dto: UpdateLeaveDto,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const updatedLeave = await this.leaveService.updateLeaveStatus(param.id, dto, param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(updatedLeave),
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: [LeaveResponseDto] })
  @ApiResponseError([
    {
      code: '0401',
      message: errorMessage['0401'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0402',
      message: errorMessage['0402'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0403',
      message: errorMessage['0403'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0404',
      message: errorMessage['0404'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0405',
      message: errorMessage['0405'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.DELETE_LEAVE] })
  @ApiOkResponse({ type: LeaveResponseDto })
  async delete(@Param() param: ValidateParamLeaveId): Promise<void> {
    await this.leaveService.deleteLeave(param.id);
    return;
  }
}
