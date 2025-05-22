import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../database/entity/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.validation';
import { UserInfoEntity } from '../database/entity/user-info.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserInfoEntity)
    private userInfoRepository: Repository<UserInfoEntity>
  ) {}

  private async validatePermissionId(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Permission ID must be a positive integer');
    }

    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });

    if (!permission || permission.delete_time) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  private async validatePermissionName(name: string): Promise<void> {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Permission name is required and cannot be empty');
    }

    const existingPermission = await this.permissionRepository.findOne({
      where: {
        name: name.trim(),
        delete_time: null
      }
    });

    if (existingPermission) {
      throw new BadRequestException(`Permission with name ${name} already exists`);
    }
  }

  private async validatePermissionCreator(creatorId: number): Promise<void> {
    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      throw new BadRequestException('Creator ID must be a positive integer');
    }

    const user = await this.userInfoRepository.findOne({
      where: { id: creatorId }
    });

    if (!user || user.delete_time) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async create(dto: CreatePermissionDto) {
    await this.validatePermissionName(dto.name);
    await this.validatePermissionCreator(dto.created_by);

    const permission = this.permissionRepository.create({
      ...dto,
      created_at: new Date(),
      update_time: new Date(),
      delete_time: null
    });

    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return this.permissionRepository.find({
      where: { delete_time: null },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      where: { id, delete_time: null },
      relations: ['createdBy']
    });
  }

  async update(id: number, dto: UpdatePermissionDto) {
    await this.validatePermissionId(id);
    
    if (dto.name) {
      await this.validatePermissionName(dto.name);
    }

    const permission = await this.permissionRepository.findOne({
      where: { id }
    });

    if (!permission || permission.delete_time) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    Object.assign(permission, dto);
    permission.update_time = new Date();

    return await this.permissionRepository.save(permission);
  }

  async softDelete(id: number) {
    await this.validatePermissionId(id);
    
    const permission = await this.permissionRepository.findOne({
      where: { id }
    });

    if (!permission || permission.delete_time) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    permission.delete_time = new Date();
    return await this.permissionRepository.save(permission);
  }

  async getPermissionById(id: number) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });
  }

  async getPermissionsByRole(roleId: number) {
    return this.permissionRepository.createQueryBuilder('permission')
      .leftJoinAndSelect('permission.rolePermissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.role', 'role')
      .where('role.id = :roleId', { roleId })
      .andWhere('role.delete_time IS NULL')
      .andWhere('permission.delete_time IS NULL')
      .getMany();
  }
}
