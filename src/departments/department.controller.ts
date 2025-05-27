import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentResponseDto,
} from './department.dto';
import { DepartmentId } from 'src/constants/department.enum';

@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.create(createDepartmentDto);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Get()
  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentService.findAll();
    return departments.map(dept => this.departmentService.toDepartmentResponseDto(dept));
  }


  @Get(':id')
  async findOne(@Param('id') id: DepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.findOne(id);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Put(':id')
  async update(
    @Param('id') id: DepartmentId,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const updatedDepartment = await this.departmentService.update(
      id,
      updateDepartmentDto,
    );
    return this.departmentService.toDepartmentResponseDto(updatedDepartment);
  }

  @Delete(':id')
  async remove(@Param('id') id: DepartmentId): Promise<void> {
    await this.departmentService.remove(id);
  }

  @Delete(':id/restore')
  async restoreDepartment(
    @Param('id') id: DepartmentId,
  ): Promise<DepartmentResponseDto> {
    const restoredDepartment = await this.departmentService.restoreDepartment(id);
    return this.departmentService.toDepartmentResponseDto(restoredDepartment);
  }

  @Delete(':id/permanent')
  async permanentlyDeleteDepartment(
    @Param('id') id: DepartmentId,
  ): Promise<void> {
    await this.departmentService.permanentlyDeleteDepartment(id);
  }
}
