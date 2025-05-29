import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto, LeaveTypeResponseDto } from './leave-type.dto';
import { LeaveType } from 'src/constants/leave-type.enum';

@Controller('leave-types')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @Roles('admin')
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeService.create(createLeaveTypeDto);
    return this.leaveTypeService.toLeaveTypeResponseDto(leaveType);
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeService.findAll();
    return leaveTypes.map(leaveType => this.leaveTypeService.toLeaveTypeResponseDto(leaveType));
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: LeaveType): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeService.findOne(id);
    return this.leaveTypeService.toLeaveTypeResponseDto(leaveType);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: LeaveType,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto
  ): Promise<LeaveTypeResponseDto> {
    const updatedLeaveType = await this.leaveTypeService.update(id, updateLeaveTypeDto);
    return this.leaveTypeService.toLeaveTypeResponseDto(updatedLeaveType);
  }

  @Patch(':id')
  @Roles('admin')
  async partialUpdate(@Param('id') id: LeaveType, @Body() data: Partial<UpdateLeaveTypeDto>): Promise<LeaveTypeResponseDto> {
    const updatedLeaveType = await this.leaveTypeService.update(id, data);
    return this.leaveTypeService.toLeaveTypeResponseDto(updatedLeaveType);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: LeaveType): Promise<void> {
    return this.leaveTypeService.softDelete(id);
  }

  @Post(':id')
  @Roles('admin')
  async restore(@Param('id') id: LeaveType): Promise<LeaveTypeResponseDto> {
    return this.leaveTypeService.restore(id);
  }
}
