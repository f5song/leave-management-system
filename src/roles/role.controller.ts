import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from './role.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: RoleResponseDto })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleService.create(createRoleDto);
    return this.roleService.toRoleResponseDto(role);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [RoleResponseDto] })
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    return roles.map(role => this.roleService.toRoleResponseDto(role));
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async findOne(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = await this.roleService.findOne(id);
    return this.roleService.toRoleResponseDto(role);
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async partialUpdate(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse()
  async remove(@Param('id') id: string): Promise<RoleResponseDto> {
    const deletedRole = await this.roleService.remove(id);
    return this.roleService.toRoleResponseDto(deletedRole);
  }
}
