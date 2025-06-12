import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.roles.dto';
import { UpdateRoleDto } from './dto/update.roles.dto';
import { RoleResponseDto } from './respones/roles.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { ERole } from '@src/common/constants/roles.enum';
import { EPermission } from '@src/common/constants/permission.enum';
import { ApiResponseError } from '../../common/decorators/api-response-error.decorator';
import { errorMessage } from '@src/common/constants/error-message';
import { HttpStatus } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ValidateParamRoleId } from '../roles/dto/roles.validate';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true })) 

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_ROLE] })
  @ApiCreatedResponse({ type: RoleResponseDto })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleService.create(createRoleDto);
    return this.roleService.toRoleResponseDto(role);
  }

  @Get()
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.READ_ROLE] })
  @ApiOkResponse({ type: [RoleResponseDto] })
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    return roles.map(role => this.roleService.toRoleResponseDto(role));
  }

  @Get(':id')
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.READ_ROLE] })
  @ApiOkResponse({ type: RoleResponseDto })
  async findOne(@Param() param: ValidateParamRoleId): Promise<RoleResponseDto> {
    const role = await this.roleService.findOne(param.id);
    return this.roleService.toRoleResponseDto(role);
  }

  @Put(':id')
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_ROLE] })
  @ApiOkResponse({ type: RoleResponseDto })
  async update(@Param() param: ValidateParamRoleId, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(param.id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Patch(':id')
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_ROLE] })
  @ApiOkResponse({ type: RoleResponseDto })
  async partialUpdate(@Param() param: ValidateParamRoleId, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(param.id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Delete(':id')
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiResponseError([
    {
      code: '0601',
      message: errorMessage['0601'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0602',
      message: errorMessage['0602'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0603',
      message: errorMessage['0603'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0604',
      message: errorMessage['0604'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: '0605',
      message: errorMessage['0605'],
      statusCode: HttpStatus.BAD_REQUEST,
    },
    {
      code: HttpStatus.INTERNAL_SERVER_ERROR + '',
      message: errorMessage[HttpStatus.INTERNAL_SERVER_ERROR],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    }
  ])
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_ROLE] })
  @ApiOkResponse()
  async remove(@Param() param: ValidateParamRoleId): Promise<RoleResponseDto> {
    const deletedRole = await this.roleService.remove(param.id);
    return this.roleService.toRoleResponseDto(deletedRole);
  }
}
