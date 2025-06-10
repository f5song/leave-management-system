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
  HttpStatus,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  UpdateDepartmentDto
} from './dto/update.department.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles.decorator';
import { DepartmentResponseDto } from './response/department.respones';
import { ResponseObject } from '@common/dto/common-response.dto';
import { ValidateParamDepartmentId } from './dto/department.validate';
import { UpdateDepartmentResponseDto } from './response/update.department.respone';

@ApiTags('Departments')
@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get()
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: {
        code: 200,
        message: 'SUCCESS',
        data: {
          id: 'HR',
          name: 'Human Resources',
          color: '#FF5733',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          DepartmentAlreadyExists: {
            summary: 'Department name already exists',
            value: {
              code: '0002',
              message: 'Department name already exists',
            },
          },
          InvalidNameLength: {
            summary: 'Name must be between 2 and 100 characters',
            value: {
              code: '0003',
              message: 'Department name must be between 2 and 100 characters',
            },
          },
          CannotDeleteWithUsers: {
            summary: 'Cannot delete department with users',
            value: {
              code: '0004',
              message: 'Cannot delete department that has users',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        code: '401',
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    schema: {
      example: {
        code: '0001',
        message: 'Department not found',
      },
    },
  })
  @Roles('admin', 'employee')
  @ApiOkResponse({ type: [DepartmentResponseDto] })
  async findAll(): Promise<ResponseObject<DepartmentResponseDto[]>> {
    const departments = await this.departmentService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: departments,
    };
  }


  @Get(':id')
  @Roles('admin', 'employee')
  @ApiOkResponse({ type: DepartmentResponseDto })
  async findOne(@Param() param: ValidateParamDepartmentId): Promise<ResponseObject<DepartmentResponseDto>> {
    const department = await this.departmentService.findOne(param.id);
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: department,
    };
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Param() param: ValidateParamDepartmentId,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<ResponseObject<DepartmentResponseDto>> {
    const department = await this.departmentService.update(
      param.id,
      updateDepartmentDto,
    );
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: department,
    };
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOkResponse({ type: UpdateDepartmentResponseDto })
  async partialUpdate(
    @Param() param: ValidateParamDepartmentId,
    @Body() partialData: UpdateDepartmentDto,
  ): Promise<ResponseObject<DepartmentResponseDto>> {
    const department = await this.departmentService.partialUpdate(
      param.id,
      partialData,
    );
    return {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: department,
    };
  }


  // @Delete(':id/restore')
  // @Roles('admin')
  // @ApiOkResponse({ type: DepartmentResponseDto })
  // async restoreDepartment(
  //   @Param('id') id: EDepartmentId,
  // ): Promise<ResponseObject<DepartmentResponseDto>> {
  //   const department = await this.departmentService.restoreDepartment(id);
  //   return {
  //     code: HttpStatus.OK,
  //     message: 'SUCCESS',
  //     data: department,
  //   };
  // }

  // @Delete(':id')
  // @Roles('admin')
  // @ApiOkResponse({ type: DepartmentResponseDto })
  // async remove(@Param('id') id: EDepartmentId): Promise<void> {
  //   await this.departmentService.remove(id);
  // }
  // @Delete(':id/permanent')
  // @Roles('admin')

  // @ApiOkResponse({ type: DepartmentResponseDto })
  // async permanentlyDeleteDepartment(
  //   @Param('id') id: DepartmentId,
  // ): Promise<void> {
  //   await this.departmentService.permanentlyDeleteDepartment(id);
  // }


  // @Post()
  // @Roles('admin')
  // @ApiCreatedResponse({ type: DepartmentResponseDto })
  // async create(
  //   @Body() createDepartmentDto: CreateDepartmentDto,
  // ): Promise<ResponseObject<DepartmentResponseDto>> {
  //   const department = await this.departmentService.create(createDepartmentDto);
  //   return {
  //     code: HttpStatus.OK,
  //     message: 'SUCCESS',
  //     data: department,
  //   };
  // }

}
