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
  Req,
  Logger,
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
import { ValidateParamUserId } from '../users/dto/users.validate';
import { RequestWithUser } from '@src/common/interfaces/request-with-user';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';

@ApiTags('Leaves')
@Controller('leaves')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')

export class LeaveController {
  private readonly logger = new Logger(LeaveController.name, { timestamp: true });
  constructor(private readonly leaveService: LeaveService) { }

  @Get('user/:userId')
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
  async getMyLeaves(@Param() param: ValidateParamUserId): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getMyLeaves(param.userId);
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
  async getAllLeaves(): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getAllLeaves();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves.map(leave => this.leaveService.toLeaveResponseDto(leave)),
    };
  }

  @Post(':userId')
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
      code: '0406',
      message: errorMessage['0406'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0407',
      message: errorMessage['0407'],
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
    @Req() req: RequestWithUser,
    @Body() dto: CreateLeaveDto,
    @Param() param: ValidateParamUserId,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const leave = await this.leaveService.createLeave(req.user.id, dto, param.userId);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(leave),
    };
  }


  @Patch(':leaveId/details')
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
    @Req() req: RequestWithUser,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const userId = req.user.id;
    // this.logger.log('User in req:', req.user);  
    // this.logger.log('User ID:', userId);
    console.log(req.user);
    const updatedLeave = await this.leaveService.updateLeaveDetails(param.leaveId, dto, userId);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(updatedLeave),
    };
  }

  @Patch(':leaveId/status')
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
    @Req() req: RequestWithUser,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const userId = req.user.id;
    const updatedLeave = await this.leaveService.updateLeaveStatus(param.leaveId, dto, userId);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(updatedLeave),
    };
  }

  @Get('id/:leaveId')
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
  @ApiOkResponse({ type: LeaveResponseDto })
  async getLeave(@Param() param: ValidateParamLeaveId): Promise<ResponseObject<LeaveResponseDto>> {
    console.log("param", param);              
    console.log("leaveId", param.leaveId);
    const leave = await this.leaveService.getLeaveId(param.leaveId);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(leave),
    };
  }

  @Delete(':leaveId')
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
    await this.leaveService.deleteLeave(param.leaveId);
    return;
  }

}
