import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { CreateJobTitleDto } from './dto/create.job-titles.dto';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { EDepartmentId } from '@common/constants/department.enum';
import { JobTitleResponseDto } from './respones/job-titles.respones.dto';
import { UpdateJobTitleDto } from './dto/update.job-titles.dto';


@Injectable()
export class JobTitleService {
  constructor(
    @InjectRepository(JobTitleEntity)
    private readonly jobTitleRepository: Repository<JobTitleEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>
  ) { }

  toJobTitleResponseDto(
    entity: JobTitleEntity
  ): JobTitleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color,
      departmentId: entity.departmentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  async validateJobTitleId(id: EJobTitleId): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['department']
    });

    if (!jobTitle) {
      throw new NotFoundException(`JobTitle with id ${id} not found`);
    }
  }

  async validateDepartmentExists(departmentId: EDepartmentId): Promise<void> {
    if (!departmentId) return;

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId, deletedAt: null }
    });

    if (!department) {
      throw new NotFoundException(`Department with id ${departmentId} not found`);
    }
  }

  async validateUniqueName(name: string, departmentId: EDepartmentId, currentId?: EJobTitleId): Promise<void> {
    if (!name || !departmentId) return;

    const jobTitle = await this.jobTitleRepository.findOne({
      where: {
        name,
        departmentId,
        deletedAt: null,
        ...(currentId && { id: Not(currentId as EJobTitleId) }),
      },
    });

    if (jobTitle) {
      throw new Error('Job title name must be unique within the department');
    }
  }

  async validateNoReferences(id: EJobTitleId): Promise<void> {
    const referenceCount = await this.jobTitleRepository.createQueryBuilder('jobTitle')
      .leftJoin('jobTitle.users', 'users')
      .where('jobTitle.id = :id', { id })
      .andWhere('users.deleted_at IS NULL')
      .getCount();

    if (referenceCount > 0) {
      throw new Error('Cannot update or delete job title as it has users associated with it');
    }

  }


  async create(createJobTitleDto: CreateJobTitleDto) {
    const { id, name, color, departmentId } = createJobTitleDto;

    await this.validateJobTitleId(id);
    await this.validateDepartmentExists(departmentId);
    await this.validateUniqueName(name, departmentId);

    const existingById = await this.jobTitleRepository.findOne({
      where: { id },
      select: ['id']
    });
    if (existingById) {
      throw new BadRequestException(`Job title with id ${id} already exists`);
    }

    const existingByName = await this.jobTitleRepository.findOne({
      where: { name },
      select: ['name']
    });
    if (existingByName) {
      throw new BadRequestException(`Job title with name ${name} already exists`);
    }

    const jobTitle = this.jobTitleRepository.create({
      id,
      name,
      color,
      departmentId,
    });

    return await this.jobTitleRepository.save(jobTitle);
  }

  async findAll(): Promise<JobTitleEntity[]> {
    return this.jobTitleRepository.find({
      relations: ['department'],
      where: { deletedAt: null },
    });
  }

  async findOne(id: EJobTitleId): Promise<JobTitleEntity> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['department'],
    });

    if (!jobTitle) {
      throw new NotFoundException(`Job title with id ${id} not found`);
    }

    return jobTitle;
  }

  async update(id: EJobTitleId, updateJobTitleDto: UpdateJobTitleDto): Promise<JobTitleEntity> {
    await this.validateJobTitleId(id);
    await this.validateDepartmentExists(updateJobTitleDto.departmentId);
    await this.validateUniqueName(updateJobTitleDto.name, updateJobTitleDto.departmentId, id);
    await this.validateNoReferences(id);

    const jobTitle = await this.findOne(id);

    if (updateJobTitleDto.name) {
      jobTitle.name = updateJobTitleDto.name;
    }

    if (updateJobTitleDto.departmentId) {
      jobTitle.departmentId = updateJobTitleDto.departmentId;
    }

    return await this.jobTitleRepository.save(jobTitle);
  }


  async softDelete(id: EJobTitleId): Promise<void> {
    await this.validateJobTitleId(id);
    await this.validateNoReferences(id);

    const jobTitle = await this.findOne(id);
    jobTitle.deletedAt = new Date();
    await this.jobTitleRepository.save(jobTitle);
  }

  
  // async remove(id: JobTitleId): Promise<void> {
  //   await this.validateJobTitleId(id);
  //   await this.validateNoReferences(id);

  //   await this.jobTitleRepository.update(id, {
  //     deletedAt: new Date()
  //   });
  // }
}
