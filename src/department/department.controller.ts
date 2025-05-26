import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UsePipes, ValidationPipe, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.validation';
import { DepartmentResponseDto } from './department-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepartmentId } from 'src/constants/department.enum';

@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<DepartmentResponseDto[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: DepartmentId): Promise<DepartmentResponseDto> {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: DepartmentId,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ): Promise<DepartmentResponseDto> {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: DepartmentId): Promise<void> {
    return this.departmentService.remove(id);
  }

  @Delete(':id/restore')
  async restoreDepartment(@Param('id') id: DepartmentId) {
    return this.departmentService.restoreDepartment(id);
  }

  @Delete(':id/permanent')
  async permanentlyDeleteDepartment(@Param('id') id: DepartmentId) {
    return this.departmentService.permanentlyDeleteDepartment(id);
  }
}
