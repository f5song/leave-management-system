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
import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles-permission.decorator';
import { DepartmentResponseDto } from './response/department.respones';
import { ResponseObject } from '@common/dto/common-response.dto';
import { ValidateParamDepartmentId } from './dto/department.validate';
import { UpdateDepartmentResponseDto } from './response/update.department.respone';
import { ApiResponseError } from '@src/common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { ERole } from '@src/common/constants/roles.enum';
import { ApiResponseSuccess } from '@src/common/decorators/api-response-success.decorator';

@ApiTags('Departments')
@Controller('departments')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get()
  @ApiResponseSuccess({
    statusCode: HttpStatus.OK,
    example: {
      code: HttpStatus.OK,
      message: 'SUCCESS',
      data: [
        { id: 'HR_TEST', name: 'Human Resources test', color: '#FF5733' },
        { id: 'HR', name: 'Human Resources test234234', color: '#00000' },
        { id: 'IT', name: 'Information Technology', color: '#3355FF' },
      ],
    },
  })
  
  @ApiResponseError([
    {
      code: '0001',
      message: errorMessage['0001'],
      statusCode: HttpStatus.NOT_FOUND,
    },
    {
      code: '0002',
      message: errorMessage['0002'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0003',
      message: errorMessage['0003'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0004',
      message: errorMessage['0004'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0005',
      message: errorMessage['0005'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0006',
      message: errorMessage['0006'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])

  @Roles(ERole.ADMIN, ERole.EMPLOYEE)
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
  @Roles(ERole.ADMIN, ERole.EMPLOYEE)
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
  @Roles(ERole.ADMIN)
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

  // @Patch(':id')
  // @Roles('admin')
  // @ApiOkResponse({ type: UpdateDepartmentResponseDto })
  // async partialUpdate(
  //   @Param() param: ValidateParamDepartmentId,
  //   @Body() partialData: UpdateDepartmentDto,
  // ): Promise<ResponseObject<DepartmentResponseDto>> {
  //   const department = await this.departmentService.partialUpdate(
  //     param.id,
  //     partialData,
  //   );
  //   return {
  //     code: HttpStatus.OK,
  //     message: 'SUCCESS',
  //     data: department,
  //   };
  // }


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
