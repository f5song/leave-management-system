import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JobTitleEntity } from '../database/entity/job-title.entity';
import { DepartmentEntity } from '../database/entity/department.entity';
import { CreateJobTitleDto, UpdateJobTitleDto } from './job-title.validation';


@Injectable()
export class JobTitleService {
  constructor(
    @InjectRepository(JobTitleEntity)
    private readonly jobTitleRepository: Repository<JobTitleEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>
  ) {}

  async create(createJobTitleDto: CreateJobTitleDto) {
    const { id, name, department_id } = createJobTitleDto;

    // Check if job title with same id already exists
    const existingById = await this.jobTitleRepository.findOne({
      where: { id },
      select: ['id']
    });
    if (existingById) {
      throw new BadRequestException(`Job title with id ${id} already exists`);
    }

    // Check if job title with same name already exists
    const existingByName = await this.jobTitleRepository.findOne({
      where: { name },
      select: ['name']
    });
    if (existingByName) {
      throw new BadRequestException(`Job title with name ${name} already exists`);
    }

    return this.jobTitleRepository.save({
      id,
      name,
      department_id
    });
  }

  async findAll() {
    return this.jobTitleRepository.find({
      where: { delete_time: null },
      relations: ['department']
    });
  }

  async findOne(id: string) {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, delete_time: null },
      relations: ['department']
    });

    if (!jobTitle) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }

    return jobTitle;
  }

  async update(id: string, updateJobTitleDto: UpdateJobTitleDto) {
    await this.validateJobTitleId(id);
    await this.validateDepartmentExists(updateJobTitleDto.department_id);
    await this.validateUniqueName(updateJobTitleDto.name, updateJobTitleDto.department_id, id);
    await this.validateNoReferences(id);

    return this.jobTitleRepository.save({
      ...updateJobTitleDto,
      id,
      update_time: new Date()
    });
  }

  async validateJobTitleId(id: string): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, delete_time: null },
      relations: ['department']
    });

    if (!jobTitle) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }
  }

  async validateDepartmentExists(departmentId: string): Promise<void> {
    if (!departmentId) return;

    const department = await this.departmentRepository.findOne({
      where: { id: Number(departmentId), delete_time: null }
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${departmentId} not found`);
    }
  }

  async validateUniqueName(name: string, departmentId: string, currentId?: string): Promise<void> {
    if (!name || !departmentId) return;

    const jobTitle = await this.jobTitleRepository.findOne({
      where: {
        name,
        department_id: departmentId as string,
        delete_time: null,
        id: currentId ? Not(currentId) : undefined,
      },
    });

    if (jobTitle) {
      throw new Error('Job title name must be unique within the department');
    }
  }

  async validateNoReferences(id: string): Promise<void> {
    const hasReferences = await this.jobTitleRepository.createQueryBuilder('jobTitle')
      .leftJoinAndSelect('jobTitle.users', 'users')
      .where('jobTitle.id = :id', { id })
      .andWhere('users.delete_time IS NULL')
      .getCount();

    if (hasReferences[0].count > 0) {
      throw new Error('Cannot update or delete job title as it has users associated with it');
    }
  }

  async remove(id: string): Promise<void> {
    await this.validateJobTitleId(id);
    await this.validateNoReferences(id);

    await this.jobTitleRepository.update(id, {
      delete_time: new Date()
    });
  }
}
