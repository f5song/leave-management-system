import { BadRequestException, HttpStatus, Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { CreateJobTitleDto } from './dto/create.job-titles.dto';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { EDepartmentId } from '@common/constants/department.enum';
import { JobTitleResponseDto } from './respones/job-titles.respones.dto';
import { UpdateJobTitleDto } from './dto/update.job-titles.dto';
import { errorMessage } from '@src/common/constants/error-message';
import { Logger } from '@nestjs/common';


@Injectable()
export class JobTitleService {
  private readonly logger = new Logger(JobTitleService.name);


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
      select: ['id'],
      where: { id, deletedAt: null },
      relations: ['department']
    });
    if (!jobTitle) {
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async validateDepartmentExists(departmentId: EDepartmentId): Promise<void> {
    if (!departmentId) return;

    const department = await this.departmentRepository.findOne({
      select: ['id'],
      where: { id: departmentId, deletedAt: null }
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async validateUniqueName(name: string, departmentId: EDepartmentId, currentId?: EJobTitleId): Promise<void> {
    if (!name || !departmentId) return;

    const jobTitle = await this.jobTitleRepository.findOne({
      select: ['id'],
      where: {
        name,
        departmentId,
        deletedAt: null,
        ...(currentId && { id: Not(currentId as EJobTitleId) }),
      },
    });

    if (jobTitle) {
      throw new HttpException({
        message: errorMessage['0102'],
        code: '0102',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async validateNoReferences(id: EJobTitleId): Promise<void> {
    const referenceCount = await this.jobTitleRepository.createQueryBuilder('jobTitle')
      .leftJoin('jobTitle.users', 'users')
      .where('jobTitle.id = :id', { id })
      .andWhere('users.deleted_at IS NULL')
      .getCount();

    if (referenceCount > 0) {
      throw new HttpException({
        message: errorMessage['0103'],
        code: '0103',
      },
        HttpStatus.BAD_REQUEST);
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
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }

    const existingByName = await this.jobTitleRepository.findOne({      
      where: { name },
      select: ['name']
    });
    if (existingByName) {
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }

    const jobTitle = this.jobTitleRepository.create({
      id,
      name,
      color,
      departmentId,
    });

    return await this.jobTitleRepository.save(jobTitle);
  }

  async findAll(): Promise<JobTitleResponseDto[]> {
    return this.jobTitleRepository.find({
      select: ['id', 'name', 'color', 'departmentId', 'createdAt', 'updatedAt', 'deletedAt'],
      relations: ['department'],
      where: { deletedAt: null },
    });
  }

  async findOne(id: EJobTitleId): Promise<JobTitleResponseDto> {
    const jobTitle = await this.jobTitleRepository.findOne({
      select: ['id', 'name', 'color', 'departmentId', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id, deletedAt: null },
      relations: ['department'],
    });

    if (!jobTitle) {
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }

    return jobTitle;
  }

  async update(id: EJobTitleId, updateJobTitleDto: UpdateJobTitleDto): Promise<JobTitleResponseDto> {
    try {
      await this.validateJobTitleId(id);
      await this.validateDepartmentExists(updateJobTitleDto.departmentId);
      await this.validateUniqueName(updateJobTitleDto.name, updateJobTitleDto.departmentId, id);
      await this.validateNoReferences(id);

      const jobTitle = await this.findOne(id);
      
      // Update fields
      if (updateJobTitleDto.name) {
        jobTitle.name = updateJobTitleDto.name;
      }
      if (updateJobTitleDto.departmentId) {
        jobTitle.departmentId = updateJobTitleDto.departmentId;
      }

      // Use transaction for atomic operation
      return await this.jobTitleRepository.manager.transaction(async transactionalEntityManager => {
        return await transactionalEntityManager.save(jobTitle);
      });
    } catch (error) {
      this.logger.error('Failed to update job title', error);
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async softDelete(id: EJobTitleId): Promise<JobTitleResponseDto> {
    try {
      await this.validateJobTitleId(id);
      await this.validateNoReferences(id);

      const jobTitle = await this.findOne(id);
      jobTitle.deletedAt = new Date();

      // Use transaction for atomic operation
      return await this.jobTitleRepository.manager.transaction(async transactionalEntityManager => {
        return await transactionalEntityManager.save(jobTitle);
      });
    } catch (error) {
      this.logger.error('Failed to soft delete job title', error);
      throw new HttpException({
        message: errorMessage['0101'],
        code: '0101',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  
  // async remove(id: JobTitleId): Promise<void> {
  //   await this.validateJobTitleId(id);
  //   await this.validateNoReferences(id);

  //   await this.jobTitleRepository.update(id, {
  //     deletedAt: new Date()
  //   });
  // }
}
