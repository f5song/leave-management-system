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
  Query,
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
import { PaginationDto } from '@src/common/dto/pagination.dto';
import { PaginatedResponseObject } from '@src/common/dto/pagination-response.dto';
import { LeavePaginationDto } from '@src/common/dto/user-pagination.dto';

@ApiTags('Leaves')
@Controller('leaves')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')

export class LeaveController {
  private readonly logger = new Logger(LeaveController.name, { timestamp: true });
  constructor(private readonly leaveService: LeaveService) { }

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
  @Get('user/:userId')
  async getMyLeaves(@Param() param: ValidateParamUserId): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getMyLeaves(param.userId);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves,
    };
  }

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
  @Get()
  async getAllLeaves(@Query("start") start?: string,
    @Query("end") end?: string): Promise<ResponseObject<LeaveResponseDto[]>> {
    const leaves = await this.leaveService.getAllLeaves(start, end);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves,
    };
  }

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
  @Post(':userId')
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateLeaveDto,
    @Param() param: ValidateParamUserId,
  ): Promise<ResponseObject<LeaveResponseDto>> {
    const leave = await this.leaveService.createLeave(req.user.id, dto, param.userId);
    // console.log(leave);
    // console.log("created at", new Date(leave.createdAt).toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    // console.log("now at", new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveService.toLeaveResponseDto(leave),
    };
  }

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
  @Patch(':leaveId/details')
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
  @Patch(':leaveId/status')
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
  @Get('id/:leaveId')
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
  @Delete(':leaveId')
  async delete(@Param() param: ValidateParamLeaveId): Promise<void> {
    await this.leaveService.deleteLeave(param.leaveId);
    return;
  }

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
  @Get('/:page/:limit')
  async getAllLeavesPagination(
    @Query() query: PaginationDto,           
    @Query() leavePaginationDto: LeavePaginationDto,        // 👈 อ่าน query string
  ): Promise<ResponseObject<PaginatedResponseObject<LeaveResponseDto>>> {
    const leaves = await this.leaveService.getAllLeavesPagination(
      query.page,
      query.limit,
      leavePaginationDto.userId,
      leavePaginationDto.status,
    );

    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: leaves,
    };
  }
}

