import { Controller, Get, Post, Param, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto } from './permission.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: PermissionResponseDto })
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.create(dto);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [PermissionResponseDto] })
  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionService.findAll();
    return permissions.map(p => this.permissionService.toPermissionResponseDto(p));
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.findOne(id);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Patch(':id' )
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    const updatedPermission = await this.permissionService.update(id, dto);
    return this.permissionService.toPermissionResponseDto(updatedPermission);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: PermissionResponseDto })
  async remove(@Param('id') id: string): Promise<PermissionResponseDto> {
    return this.permissionService.softDelete(id);
  }
}
