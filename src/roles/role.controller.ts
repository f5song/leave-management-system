import { Controller, Get, Post, Put, Delete, Param, Body, Patch } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from './role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleService.create(createRoleDto);
    return this.roleService.toRoleResponseDto(role);
  }

  @Get()
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    return roles.map(role => this.roleService.toRoleResponseDto(role));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.roleService.findOne(id);
    return this.roleService.toRoleResponseDto(role);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Patch(':id')
  async partialUpdate(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<RoleResponseDto> {
    const deletedRole = await this.roleService.remove(id);
    return this.roleService.toRoleResponseDto(deletedRole);
  }
}
