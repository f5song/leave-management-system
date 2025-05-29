import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionResponseDto } from './permission.dto';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.create(dto);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Get()
  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionService.findAll();
    return permissions.map(p => this.permissionService.toPermissionResponseDto(p));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionService.findOne(id);
    return this.permissionService.toPermissionResponseDto(permission);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePermissionDto): Promise<PermissionResponseDto> {
    const updatedPermission = await this.permissionService.update(id, dto);
    return this.permissionService.toPermissionResponseDto(updatedPermission);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.permissionService.softDelete(id);
  }
}
