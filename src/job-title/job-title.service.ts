import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobTitleDto, UpdateJobTitleDto } from './dto';

@Injectable()
export class JobTitleService {
  constructor(private prisma: PrismaService) {}

  async create(createJobTitleDto: CreateJobTitleDto) {
    const { id, name, department_id } = createJobTitleDto;

    return this.prisma.jobTitle.create({
      data: {
        id,
        name,
        department_id, 
      },
    });
  }

  async findAll() {
    return this.prisma.jobTitle.findMany({
      where: {
        delete_time: null,
      },
      include: {
        department: true, 
      },
    });
  }

  async findOne(id: string) {
    const jobTitle = await this.prisma.jobTitle.findUnique({
      where: { id },
      include: {
        department: true, 
      },
    });

    if (!jobTitle || jobTitle.delete_time) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }

    return jobTitle;
  }

  async update(id: string, updateJobTitleDto: UpdateJobTitleDto) {
    await this.validateJobTitleId(id);
    await this.validateDepartmentExists(updateJobTitleDto.department_id);
    await this.validateUniqueName(updateJobTitleDto.name, updateJobTitleDto.department_id, id);
    await this.validateNoReferences(id);

    return this.prisma.jobTitle.update({
      where: { id },
      data: {
        ...updateJobTitleDto,
        update_time: new Date(),
      },
    });
  }

  async validateJobTitleId(id: string): Promise<void> {
    const jobTitle = await this.prisma.jobTitle.findUnique({
      where: { id },
      include: { department: true },
    });

    if (!jobTitle || jobTitle.delete_time) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }
  }

  async validateDepartmentExists(departmentId: string): Promise<void> {
    if (!departmentId) return;

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department || department.delete_time) {
      throw new NotFoundException(`Department with id ${departmentId} not found`);
    }
  }

  async validateUniqueName(name: string, departmentId: string, currentId?: string): Promise<void> {
    if (!name || !departmentId) return;

    const jobTitle = await this.prisma.jobTitle.findFirst({
      where: {
        name,
        department_id: departmentId,
        delete_time: null,
        ...(currentId ? { id: { not: currentId } } : {}),
      },
    });

    if (jobTitle) {
      throw new Error('Job title name must be unique within the department');
    }
  }

  async validateNoReferences(id: string): Promise<void> {
    const hasReferences = await this.prisma.$queryRaw<{
      count: number;
    }>`
      SELECT COUNT(*) as count FROM "User" WHERE "job_title_id" = ${id};
    `;

    if (hasReferences[0].count > 0) {
      throw new Error('Cannot update or delete job title as it has users associated with it');
    }
  }

  async remove(id: string): Promise<void> {
    await this.validateJobTitleId(id);
    await this.validateNoReferences(id);

    await this.prisma.jobTitle.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
