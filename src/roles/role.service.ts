import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../database/entity/roles.entity';
import { UserEntity } from '../database/entity/users.entity';
import { CreateRoleDto, UpdateRoleDto } from './role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>
  ) {}

  private async validateRoleId(id: string): Promise<void> {
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

  async findAll() {
    return this.roleRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string) {
    await this.validateRoleId(id);
    return this.roleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['createdBy', 'user'],
    });
  }

  async create(data: CreateRoleDto) {
    await this.validateRoleName(data.name);
    await this.validateRoleCreator(data.createdBy);

    const user = await this.userInfoRepository.findOne({
      where: { id: data.createdBy },
      relations: ['createdRoles']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${data.createdBy} not found`);
    }

    const role = this.roleRepository.create({
      name: data.name,
      createdBy: user,
      createdAt: new Date()
    });

    return this.roleRepository.save(role);
  }

  async update(id: string, data: UpdateRoleDto) {
    await this.validateRoleId(id);
    
    if (data.name) {
      await this.validateRoleName(data.name);
    }

    const role = await this.roleRepository.findOne({
      where: { id },
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

  async softDelete(id: string) {
    await this.validateRoleId(id);
    
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    
    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.deletedAt = new Date();
    return this.roleRepository.save(role);
  }
}
