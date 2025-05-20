import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  private async validatePermissionId(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Permission ID must be a positive integer');
    }

    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!permission || permission.delete_time) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  private async validatePermissionName(name: string): Promise<void> {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new BadRequestException('Permission name is required and cannot be empty');
    }

    const existingPermission = await this.prisma.permission.findFirst({
      where: {
        name: name.trim(),
        delete_time: null,
      },
    });

    if (existingPermission) {
      throw new BadRequestException(`Permission with name ${name} already exists`);
    }
  }

  private async validatePermissionCreator(creatorId: number): Promise<void> {
    if (!Number.isInteger(creatorId) || creatorId <= 0) {
      throw new BadRequestException('Creator ID must be a positive integer');
    }

    const user = await this.prisma.userInfo.findUnique({
      where: { id: creatorId },
    });

    if (!user || user.delete_time) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async create(dto: CreatePermissionDto) {
    await this.validatePermissionName(dto.name);
    await this.validatePermissionCreator(dto.created_by);

    return this.prisma.permission.create({
      data: {
        ...dto,
        created_at: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      where: { delete_time: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    await this.validatePermissionId(id);
    return this.prisma.permission.findFirst({
      where: { id, delete_time: null },
    });
  }

  async update(id: number, dto: UpdatePermissionDto) {
    await this.validatePermissionId(id);
    
    if (dto.name) {
      await this.validatePermissionName(dto.name);
    }

    return this.prisma.permission.update({
      where: { id },
      data: { 
        ...dto,
        update_time: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    await this.validatePermissionId(id);
    
    return this.prisma.permission.update({
      where: { id },
      data: { 
        delete_time: new Date(),
      },
    });
  }

  async getPermissionById(id: number) {
    await this.validatePermissionId(id);
    return this.prisma.permission.findUnique({
      where: { id },
      include: {
        createdBy: true,
      },
    });
  }

  async getPermissionsByRole(roleId: number) {
    return this.prisma.rolePermission.findMany({
      where: {
        role_id: roleId,
        role: { delete_time: null },
        permission: { delete_time: null },
      },
      include: {
        permission: true,
      },
    });
  }
}
