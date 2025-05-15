import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      where: { delete_time: null },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findFirst({
      where: { id, delete_time: null },
    });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return role;
  }

  async create(data: CreateRoleDto) {
    return this.prisma.role.create({ data });
  }

  async update(id: number, data: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.role.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
