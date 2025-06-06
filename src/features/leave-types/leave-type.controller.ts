import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { LeaveTypeService } from './leave-type.service';
import { LeaveTypeResponseDto } from './dto/leave-types.respones.dto';
import { CreateLeaveTypeDto } from './dto/create.leave-types.dto';
import { UpdateLeaveTypeDto } from './dto/update.leave-types.dto';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Leave Types')
@Controller('leave-types')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: LeaveTypeResponseDto })
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeService.create(createLeaveTypeDto);
    return this.leaveTypeService.toLeaveTypeResponseDto(leaveType);
  }

  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [LeaveTypeResponseDto] })
  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeService.findAll();
    return leaveTypes.map(leaveType => this.leaveTypeService.toLeaveTypeResponseDto(leaveType));
  }

  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async findOne(@Param('id') id: ELeaveType): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeService.findOne(id);
    return this.leaveTypeService.toLeaveTypeResponseDto(leaveType);
  }

  @Put(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async update(
    @Param('id') id: ELeaveType,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto
  ): Promise<LeaveTypeResponseDto> {
    const updatedLeaveType = await this.leaveTypeService.update(id, updateLeaveTypeDto);
    return this.leaveTypeService.toLeaveTypeResponseDto(updatedLeaveType);
  }

  @Patch(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async partialUpdate(@Param('id') id: ELeaveType, @Body() data: Partial<UpdateLeaveTypeDto>): Promise<LeaveTypeResponseDto> {
    console.log('Received PATCH body:', data);
    return await this.leaveTypeService.partialUpdate(id, data);
  }
  
  @Delete(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async remove(@Param('id') id: ELeaveType): Promise<void> {
    return this.leaveTypeService.softDelete(id);
  }

  @Post(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveTypeResponseDto })
  async restore(@Param('id') id: ELeaveType): Promise<LeaveTypeResponseDto> {
    return this.leaveTypeService.restore(id);
  }
}
