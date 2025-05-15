import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common';
import { LeaveTypeService } from './leave-type.service';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dto';

@Controller('leave-type')
export class LeaveTypeController {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Get()
  async getAll() {
    return this.leaveTypeService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.leaveTypeService.findOne(id);
  }

  @Post()
  async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto) {
    return this.leaveTypeService.create(createLeaveTypeDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto) {
    return this.leaveTypeService.update(id, updateLeaveTypeDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto) {
    return this.leaveTypeService.partialUpdate(id, updateLeaveTypeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.leaveTypeService.softDelete(id);
  }
}
