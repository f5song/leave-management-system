import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../database/entity/permissions.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './permission.dto';
import { UserEntity } from '../database/entity/users.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>
  ) { }

  private async validatePermissionId(id: string): Promise<void> {

    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });

    if (!permission || permission.deletedAt) {
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
        deletedAt: null
      }
    });

    if (existingPermission) {
      throw new BadRequestException(`Permission with name ${name} already exists`);
    }
  }

  private async validatePermissionCreatedById(creatorId: string): Promise<void> {

    const user = await this.userInfoRepository.findOne({
      where: { id: creatorId }
    });

    if (!user || user.deletedAt) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async create(dto: CreatePermissionDto) {
    // Validate permission name and creator ID
    await this.validatePermissionName(dto.name);
    await this.validatePermissionCreatedById(dto.createdById);

    // Fetch the user who's creating this permission
    const user = await this.userInfoRepository.findOne({
      where: { id: dto.createdById },
      relations: ['createdPermissions']
    });

    // Create new permission with the DTO data and set the creator
    const permission = this.permissionRepository.create({
      ...dto,
      createdById: user.id
    });

    // Save the new permission to the database
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return this.permissionRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['createdBy']
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.validatePermissionId(id);

    if (dto.name) {
      await this.validatePermissionName(dto.name);
    }

    const permission = await this.permissionRepository.findOne({
      where: { id }
    });

    if (!permission || permission.deletedAt) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    Object.assign(permission, dto);
    permission.updatedAt = new Date();

    return await this.permissionRepository.save(permission);
  }

  async softDelete(id: string) {
    await this.validatePermissionId(id);

    const permission = await this.permissionRepository.findOne({
      where: { id }
    });

    if (!permission || permission.deletedAt) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    permission.deletedAt = new Date();
    return await this.permissionRepository.save(permission);
  }

  async getPermissionById(id: string) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });
  }

  async getPermissionsByRole(roleId: string) {
    return this.permissionRepository.createQueryBuilder('permission')
      .leftJoinAndSelect('permission.rolePermissions', 'rolePermission')
      .leftJoinAndSelect('rolePermission.role', 'role')
      .where('role.id = :roleId', { roleId })
      .andWhere('role.deletedAt IS NULL')
      .andWhere('permission.deletedAt IS NULL')
      .getMany();
  }
}
