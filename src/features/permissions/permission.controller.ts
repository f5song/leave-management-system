import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create.permissions.dto';
import { UpdatePermissionDto } from './dto/update.permissions.dto';
import { PermissionResponseDto } from './dto/permissions.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/guards/roles-permission.decorator';
import { EPermission } from '@src/common/constants/permission.enum';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: PermissionResponseDto })
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.create(dto);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [PermissionResponseDto] })
  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionService.findAll();
    return permissions.map(p => this.permissionService.toPermissionResponseDto(p));
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async findOne(@Param('id') id: EPermission): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.findOne(id);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Patch(':id' )
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async update(@Param('id') id: EPermission, @Body() dto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    const updatedPermission = await this.permissionService.update(id, dto);
    return this.permissionService.toPermissionResponseDto(updatedPermission);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async remove(@Param('id') id: EPermission): Promise<PermissionResponseDto> {
    return this.permissionService.softDelete(id);
  }
}
