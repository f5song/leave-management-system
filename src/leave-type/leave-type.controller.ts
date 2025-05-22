import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LeaveTypeService } from './leave-type.service';
import { LeaveType } from './leave-type.entity';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './leave-type.validation';
import { LeaveTypeResponseDto } from './leave-type-response.dto';

@Controller('leave-types')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) { }

  @Post()
  @Roles('admin')
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    return this.leaveTypeService.create(createLeaveTypeDto);
  }

  @Get()
  @Roles('admin')
  async findAll(): Promise<LeaveTypeResponseDto[]> {
    return this.leaveTypeService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: number): Promise<LeaveTypeResponseDto> {
    return this.leaveTypeService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateLeaveTypeDto: UpdateLeaveTypeDto
  ): Promise<LeaveTypeResponseDto> {
    return this.leaveTypeService.update(id, updateLeaveTypeDto);
  }

  @Patch(':id')
  @Roles('admin')
  async partialUpdate(@Param('id') id: string, @Body() data: Partial<UpdateLeaveTypeDto>): Promise<LeaveType> {
    return this.leaveTypeService.partialUpdate(parseInt(id), data);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<void> {
    return this.leaveTypeService.delete(id);
  }
}
