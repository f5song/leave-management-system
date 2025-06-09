import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../database/entity/roles.entity';
import { UserEntity } from '../../database/entity/users.entity';
import { CreateRoleDto } from './dto/create.roles.dto';
import { UpdateRoleDto } from './dto/update.roles.dto';
import { RoleResponseDto } from './dto/roles.respones.dto';
import { ERole } from '@src/common/constants/roles.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>
  ) { }

  toRoleResponseDto(
    entity: RoleEntity
  ): RoleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdById: entity.createdById,
      createdBy: entity.createdBy,
      user: entity.user,
      permissions: entity.permissionRoles.map(permission => permission.permission),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  private async validateRoleId(id: ERole): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }

  private async validateRoleName(name: string): Promise<void> {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Role name is required and cannot be empty');
    }

    const existingRole = await this.roleRepository.findOne({
      where: {
        name: name.trim(),
        deletedAt: null,
      },
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name ${name} already exists`);
    }
  }

  private async validateRoleCreator(creatorId: string): Promise<void> {
    const user = await this.userInfoRepository.findOne({
      where: { id: creatorId },
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
      relations: ['createdBy', 'user', 'permissions']
    });
  }

  async findOne(id: ERole): Promise<RoleEntity> {
    await this.validateRoleId(id);
    const role = await this.roleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['createdBy', 'user', 'permissions']
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async create(data: CreateRoleDto): Promise<RoleEntity> {
    await this.validateRoleName(data.name);
    await this.validateRoleCreator(data.createdBy);

    const user = await this.userInfoRepository.findOne({
      where: { id: data.createdBy },
      relations: ['createdRoles']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${data.createdBy} not found`);
    }

    return this.roleRepository.save({
      name: data.name,
      createdById: data.createdBy,
      createdBy: user,
    });
  }

  async update(id: ERole, data: UpdateRoleDto): Promise<RoleEntity> {
    await this.validateRoleId(id);
    
    if (data.name) {
      await this.validateRoleName(data.name);
    }
    
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['createdBy', 'user', 'permissions']
    });
    
    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    Object.assign(role, {
      ...data,
      updateTime: new Date(),
    });
    
    return this.roleRepository.save(role);
  }

  async remove(id: ERole): Promise<RoleEntity> {
    await this.validateRoleId(id);
    
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['createdBy', 'user', 'permissions']
    });
    
    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.deletedAt = new Date();
    return this.roleRepository.save(role);
  }
}
