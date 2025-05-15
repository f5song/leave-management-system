import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: { delete_time: null },
    });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.prisma.department.findFirst({
      where: { id, delete_time: null },
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return department;
  }

  async create(data: { id: string; name: string }): Promise<Department> {
    return this.prisma.department.create({ data });
  }

  async update(id: string, data: { name: string }): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async partialUpdate(id: string, data: Partial<{ name: string }>): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async softDelete(id: string): Promise<Department> {
    return this.prisma.department.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
