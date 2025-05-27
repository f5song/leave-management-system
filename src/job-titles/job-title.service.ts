import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JobTitleEntity } from '../database/entity/job-titles.entity';
import { DepartmentEntity } from '../database/entity/departments.entity';
import { CreateJobTitleDto, UpdateJobTitleDto } from './job-title.dto';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { DepartmentId } from 'src/constants/department.enum';


@Injectable()
export class JobTitleService {
  constructor(
    @InjectRepository(JobTitleEntity)
    private readonly jobTitleRepository: Repository<JobTitleEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>
  ) {}

  async create(createJobTitleDto: CreateJobTitleDto) {
    const { id, name, departmentId } = createJobTitleDto;

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
      departmentId
    });
  }

  async findAll() {
    return this.jobTitleRepository.find({
      where: { deletedAt: null },
      relations: ['department']
    });
  }

  async findOne(id: JobTitleId) {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['department']
    });

    if (!jobTitle) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }

    return jobTitle;
  }

  async update(id: JobTitleId, updateJobTitleDto: UpdateJobTitleDto) {
    await this.validateJobTitleId(id);
    await this.validateDepartmentExists(updateJobTitleDto.departmentId);
    await this.validateUniqueName(updateJobTitleDto.name, updateJobTitleDto.departmentId, id);
    await this.validateNoReferences(id);

    return this.jobTitleRepository.save({
      ...updateJobTitleDto,
      id,
      updateTime: new Date()
    });
  }

  async validateJobTitleId(id: JobTitleId): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['department']
    });

    if (!jobTitle) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }
  }

  async validateDepartmentExists(departmentId: DepartmentId): Promise<void> {
    if (!departmentId) return;

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId, deletedAt: null }
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${departmentId} not found`);
    }
  }

  async validateUniqueName(name: string, departmentId: DepartmentId, currentId?: JobTitleId): Promise<void> {
    if (!name || !departmentId) return;
  
    const jobTitle = await this.jobTitleRepository.findOne({
      where: {
        name,
        departmentId,
        deletedAt: null,
        ...(currentId && { id: Not(currentId as JobTitleId) }),
      },
    });
  
    if (jobTitle) {
      throw new Error('Job title name must be unique within the department');
    }
  }

  async validateNoReferences(id: JobTitleId): Promise<void> {
    const hasReferences = await this.jobTitleRepository.createQueryBuilder('jobTitle')
      .leftJoinAndSelect('jobTitle.users', 'users')
      .where('jobTitle.id = :id', { id })
      .andWhere('users.deletedAt IS NULL')
      .getCount();

    if (hasReferences[0].count > 0) {
      throw new Error('Cannot update or delete job title as it has users associated with it');
    }
  }

  async remove(id: JobTitleId): Promise<void> {
    await this.validateJobTitleId(id);
    await this.validateNoReferences(id);

    await this.jobTitleRepository.update(id, {
      deletedAt: new Date()
    });
  }
}
