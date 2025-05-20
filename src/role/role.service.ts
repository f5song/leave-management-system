import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  private async validateRoleId(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Role ID must be a positive integer');
    }

    const role = await this.prisma.role.findUnique({
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

    const existingRole = await this.prisma.role.findFirst({
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

    const user = await this.prisma.userInfo.findUnique({
      where: { id: creatorId },
    });

    if (!user || user.delete_time) {
      throw new NotFoundException(`User with ID ${creatorId} not found`);
    }
  }

  async findAll() {
    return this.prisma.role.findMany({
      where: { delete_time: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    await this.validateRoleId(id);
    return this.prisma.role.findFirst({
      where: { id, delete_time: null },
      include: {
        createdBy: true,
        user: true,
      },
    });
  }

  async create(data: CreateRoleDto) {
    await this.validateRoleName(data.name);
    await this.validateRoleCreator(data.created_by);

    return this.prisma.role.create({
      data: {
        ...data,
        created_at: new Date(),
      },
    });
  }

  async update(id: number, data: UpdateRoleDto) {
    await this.validateRoleId(id);
    
    if (data.name) {
      await this.validateRoleName(data.name);
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    await this.validateRoleId(id);
    
    return this.prisma.role.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
