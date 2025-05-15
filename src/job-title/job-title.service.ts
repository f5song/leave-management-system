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
    const jobTitle = await this.prisma.jobTitle.findUnique({ where: { id } });

    if (!jobTitle || jobTitle.delete_time) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }

    return this.prisma.jobTitle.update({
      where: { id },
      data: {
        ...updateJobTitleDto,
        update_time: new Date(),
      },
    });
  }

  async remove(id: string) {
    const jobTitle = await this.prisma.jobTitle.findUnique({ where: { id } });

    if (!jobTitle || jobTitle.delete_time) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }

    return this.prisma.jobTitle.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
