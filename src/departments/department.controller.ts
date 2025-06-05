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
  Patch,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentResponseDto,
  PartialUpdateDepartmentDto,
} from './department.dto';
import { DepartmentId } from 'src/constants/department.enum';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Departments')
@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: DepartmentResponseDto })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.create(createDepartmentDto);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Get()
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentService.findAll();
    return departments.map(dept => this.departmentService.toDepartmentResponseDto(dept));
  }


  @Get(':id')
  @Roles('role-admin', 'role-employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async findOne(@Param('id') id: DepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.findOne(id);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Put(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: DepartmentResponseDto })
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

  @Patch(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async partialUpdate(
    @Param('id') id: DepartmentId,
    @Body() partialData: PartialUpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const updatedDepartment = await this.departmentService.partialUpdate(
      id,
      partialData,
    );
    return this.departmentService.toDepartmentResponseDto(updatedDepartment);
  }

  @Delete(':id')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async remove(@Param('id') id: DepartmentId): Promise<void> {
    await this.departmentService.remove(id);
  }

  @Delete(':id/restore')
  @Roles('role-admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async restoreDepartment(
    @Param('id') id: DepartmentId,
  ): Promise<DepartmentResponseDto> {
    const restoredDepartment = await this.departmentService.restoreDepartment(id);
    return this.departmentService.toDepartmentResponseDto(restoredDepartment);
  }

  // @Delete(':id/permanent')
  // @Roles('role-admin')
  // @ApiBearerAuth('access-token')
  // @ApiOkResponse({ type: DepartmentResponseDto })
  // async permanentlyDeleteDepartment(
  //   @Param('id') id: DepartmentId,
  // ): Promise<void> {
  //   await this.departmentService.permanentlyDeleteDepartment(id);
  // }
}
