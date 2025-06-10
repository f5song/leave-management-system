import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create.roles.dto';
import { UpdateRoleDto } from './dto/update.roles.dto';
import { RoleResponseDto } from './dto/roles.respones.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles-permission.decorator';
import { ERole } from '@src/common/constants/roles.enum';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post() 
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: RoleResponseDto })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const role = await this.roleService.create(createRoleDto);
    return this.roleService.toRoleResponseDto(role);
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [RoleResponseDto] })
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.roleService.findAll();
    return roles.map(role => this.roleService.toRoleResponseDto(role));
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async findOne(@Param('id') id: ERole): Promise<RoleResponseDto> {
    const role = await this.roleService.findOne(id);
    return this.roleService.toRoleResponseDto(role);
  }

  @Put(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async update(@Param('id') id: ERole, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: RoleResponseDto })
  async partialUpdate(@Param('id') id: ERole, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const updatedRole = await this.roleService.update(id, updateRoleDto);
    return this.roleService.toRoleResponseDto(updatedRole);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse()
  async remove(@Param('id') id: ERole): Promise<RoleResponseDto> {
    const deletedRole = await this.roleService.remove(id);
    return this.roleService.toRoleResponseDto(deletedRole);
  }
}
