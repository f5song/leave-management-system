import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create.permissions.dto';
import { UpdatePermissionDto } from './dto/update.permissions.dto';
import { PermissionResponseDto } from './respones/permissions.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EPermission } from '@src/common/constants/permission.enum';
import { RolesPermission } from '../../common/decorators/roles-permission.decorator';
import { ERole } from '@src/common/constants/roles.enum';
import { ValidateParamPermissionId } from './dto/permission.validate';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.CREATE_PERMISSION] })
  @ApiCreatedResponse({ type: PermissionResponseDto })
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.create(dto);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Get()
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.READ_PERMISSION] })
  @ApiOkResponse({ type: [PermissionResponseDto] })
  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionService.findAll();
    return permissions.map(p => this.permissionService.toPermissionResponseDto(p));
  }

  @Get(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.READ_PERMISSION] })
  @ApiOkResponse({ type: PermissionResponseDto })
  async findOne(@Param() param: ValidateParamPermissionId): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.findOne(param.id);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Patch(':id' )
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.UPDATE_PERMISSION] })
  @ApiOkResponse({ type: PermissionResponseDto })
  async update(@Param() param: ValidateParamPermissionId, @Body() dto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    const updatedPermission = await this.permissionService.update(param.id, dto);
    return this.permissionService.toPermissionResponseDto(updatedPermission);
  }

  @Delete(':id')
  @RolesPermission({ role: [ERole.ADMIN], permissions: [EPermission.DELETE_PERMISSION] })
  @ApiOkResponse({ type: PermissionResponseDto })
  async remove(@Param() param: ValidateParamPermissionId): Promise<PermissionResponseDto> {
    return this.permissionService.softDelete(param.id);
  }
}
