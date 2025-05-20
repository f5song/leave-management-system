import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Department } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async validateDepartmentId(id: string) {
    if (!uuidv4().match(id)) {
      throw new BadRequestException('Invalid department ID format');
    }
  }

  async validateUniqueName(name: string) {
    const existingDepartment = await this.prisma.department.findFirst({
      where: { name, delete_time: null },
    });
    if (existingDepartment) {
      throw new BadRequestException('Department name already exists');
    }
  }

  async validateNameLength(name: string) {
    if (name.length < 2 || name.length > 100) {
      throw new BadRequestException('Department name must be between 2 and 100 characters');
    }
  }

  async validateNoReferences(id: string): Promise<void> {
    // ตรวจสอบว่ามี user ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasUsers = await this.prisma.userInfo.findFirst({
      where: {
        department_id: id,
        delete_time: null,
      },
    });

    if (hasUsers) {
      throw new BadRequestException('Cannot delete department that has users');
    }

    // ตรวจสอบว่ามี job title ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasJobTitles = await this.prisma.jobTitle.findFirst({
      where: {
        department_id: id,
        delete_time: null,
      },
    });

    if (hasJobTitles) {
      throw new BadRequestException('Cannot delete department that has job titles');
    }
  }

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany({
      where: { delete_time: null },
    });
  }

  async findOne(id: string): Promise<Department> {
    this.validateDepartmentId(id);
    const department = await this.prisma.department.findFirst({
      where: { id, delete_time: null },
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return department;
  }

  async create(data: { id: string; name: string }): Promise<Department> {
    await this.validateDepartmentId(data.id);
    await this.validateNameLength(data.name);
    await this.validateUniqueName(data.name);
    return this.prisma.department.create({ data });
  }

  async update(id: string, data: { name: string }): Promise<Department> {
    await this.validateDepartmentId(id);
    const department = await this.findOne(id);
    
    if (data.name && data.name !== department.name) {
      await this.validateNameLength(data.name);
      await this.validateUniqueName(data.name);
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async partialUpdate(id: string, data: Partial<{ name: string }>): Promise<Department> {
    await this.validateDepartmentId(id);
    await this.validateNoReferences(id);
    const department = await this.findOne(id);
    
    if (data.name && data.name !== department.name) {
      await this.validateNameLength(data.name);
      await this.validateUniqueName(data.name);
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async softDelete(id: string): Promise<Department> {
    await this.validateDepartmentId(id);
    const department = await this.findOne(id);
    await this.validateNoReferences(id);

    return this.prisma.department.update({
      where: { id },
      data: {
        delete_time: new Date(),
        update_time: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Department> {
    await this.validateDepartmentId(id);
    const department = await this.prisma.department.findFirst({
      where: {
        id,
        delete_time: { not: null },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found or not deleted`);
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        delete_time: null,
        update_time: new Date(),
      },
    });
  }
}
