import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.partialUpdate(id, updateDepartmentDto);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.departmentService.softDelete(id);
  }
}
