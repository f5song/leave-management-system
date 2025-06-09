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
  UpdateDepartmentDto
} from './dto/update.department.dto';
import { EDepartmentId } from '@common/constants/department.enum';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { DepartmentResponseDto } from './dto/department.response.dto';
import { CreateDepartmentDto } from './dto/create.department.dto';

@ApiTags('Departments')
@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Post()
  @Roles('admin')
  @ApiCreatedResponse({ type: DepartmentResponseDto })
  async create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.create(createDepartmentDto);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Get()
  @Roles('admin', 'employee')
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentService.findAll();
    return departments.map(dept => this.departmentService.toDepartmentResponseDto(dept));
  }


  @Get(':id')
  @Roles('admin', 'employee')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async findOne(@Param('id') id: EDepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentService.findOne(id);
    return this.departmentService.toDepartmentResponseDto(department);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async update(
    @Param('id') id: EDepartmentId,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const updatedDepartment = await this.departmentService.update(
      id,
      updateDepartmentDto,
    );
    return this.departmentService.toDepartmentResponseDto(updatedDepartment);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async partialUpdate(
    @Param('id') id: EDepartmentId,
    @Body() partialData: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const updatedDepartment = await this.departmentService.partialUpdate(
      id,
      partialData,
    );
    return this.departmentService.toDepartmentResponseDto(updatedDepartment);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async remove(@Param('id') id: EDepartmentId): Promise<void> {
    await this.departmentService.remove(id);
  }

  @Delete(':id/restore')
  @Roles('admin')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async restoreDepartment(
    @Param('id') id: EDepartmentId,
  ): Promise<DepartmentResponseDto> {
    const restoredDepartment = await this.departmentService.restoreDepartment(id);
    return this.departmentService.toDepartmentResponseDto(restoredDepartment);
  }

  // @Delete(':id/permanent')
  // @Roles('admin')
  
  // @ApiOkResponse({ type: DepartmentResponseDto })
  // async permanentlyDeleteDepartment(
  //   @Param('id') id: DepartmentId,
  // ): Promise<void> {
  //   await this.departmentService.permanentlyDeleteDepartment(id);
  // }
}
