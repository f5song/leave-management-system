import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../database/entity/role.entity';
import { UserInfoEntity } from '../database/entity/user-info.entity';
import { CreateRoleDto, UpdateRoleDto } from './role.validation';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserInfoEntity)
    private userInfoRepository: Repository<UserInfoEntity>
  ) {}

  private async validateRoleId(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Role ID must be a positive integer');
    }

    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role || role.delete_time) {
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
        delete_time: null,
      },
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name ${name} already exists`);
    }
  }

  private async validateRoleCreator(creatorId: number): Promise<void> {
    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      throw new BadRequestException('Creator ID must be a positive integer');
    }

    const user = await this.userInfoRepository.findOne({
      where: { id: creatorId },
    });

    if (!user || user.delete_time) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async findAll() {
    return this.roleRepository.find({
      where: { delete_time: null },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number) {
    await this.validateRoleId(id);
    return this.roleRepository.findOne({
      where: { id, delete_time: null },
      relations: ['createdBy', 'user'],
    });
  }

  async create(data: CreateRoleDto) {
    await this.validateRoleName(data.name);
    await this.validateRoleCreator(data.created_by);

    const role = this.roleRepository.create({
      ...data,
      created_at: new Date(),
    });
    return this.roleRepository.save(role);
  }

  async update(id: number, data: UpdateRoleDto) {
    await this.validateRoleId(id);
    
    if (data.name) {
      await this.validateRoleName(data.name);
    }

    const role = await this.roleRepository.findOne({
      where: { id },
    });
    
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    Object.assign(role, {
      ...data,
      update_time: new Date(),
    });
    
    return this.roleRepository.save(role);
  }

  async softDelete(id: number) {
    await this.validateRoleId(id);
    
    const role = await this.roleRepository.findOne({
      where: { id },
    });
    
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    role.delete_time = new Date();
    return this.roleRepository.save(role);
  }
}
