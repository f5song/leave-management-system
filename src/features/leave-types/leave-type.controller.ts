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

@ApiTags('Leave Types')
@Controller('leave-types')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_LEAVE_TYPE] })
  @ApiCreatedResponse({ type: LeaveTypeResponseDto })
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const leaveType = await this.leaveTypeService.create(createLeaveTypeDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveTypeService(leaveType),
    };
  }

  @Get()
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
  @RolesPermission({ role: [ERole.ADMIN, ERole.EMPLOYEE], permissions: [EPermission.READ_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async findOne(@Param('id') id: ELeaveType): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const leaveType = await this.leaveTypeService.findOne(id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveTypeService.toLeaveTypeResponseDto(leaveType),
    };
  }

  @Put(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async update(
    @Param('id') id: ELeaveType,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto
  ): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const updatedLeaveType = await this.leaveTypeService.update(id, updateLeaveTypeDto);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveTypeService.toLeaveTypeResponseDto(updatedLeaveType),
    };
  }

  @Patch(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async partialUpdate(@Param('id') id: ELeaveType, @Body() data: Partial<UpdateLeaveTypeDto>): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const updatedLeaveType = await this.leaveTypeService.partialUpdate(id, data);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveTypeService.toLeaveTypeResponseDto(updatedLeaveType),
    };
  }
  
  @Delete(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async remove(@Param('id') id: ELeaveType): Promise<void> {
    return this.leaveTypeService.softDelete(id);
  }

  @Post(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_LEAVE_TYPE] })
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async restore(@Param('id') id: ELeaveType): Promise<ResponseObject<LeaveTypeResponseDto>> {
    const restoredLeaveType = await this.leaveTypeService.restore(id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: this.leaveTypeService.toLeaveTypeResponseDto(restoredLeaveType),
    };
  }
}
