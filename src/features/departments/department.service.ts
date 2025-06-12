import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { UpdateDepartmentDto } from './dto/update.department.dto';
import { EDepartmentId } from '@common/constants/department.enum';
import { errorMessage } from '@src/common/constants/error-message';
import { DepartmentResponseDto } from './response/department.respones';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>
  ) { }

  private async validateUniqueName(name: string) {
    const existingDepartment = await this.departmentRepository.findOne({
      select: ['id', 'name', 'color'],
      where: { name },
    });
    if (existingDepartment) {
      throw new HttpException({
        message: errorMessage['0002'],
        code: '0002',
      },
        HttpStatus.BAD_REQUEST);
    }
  }


  async validateNoReferences(id: EDepartmentId): Promise<void> {
    const hasUsers = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.users', 'users')
      .where('users.departmentId = :id', { id })
      .andWhere('users.deletedAt IS NULL')
      .getOne();

    if (hasUsers) {
      throw new HttpException({
        message: errorMessage['0004'],
        code: '0004',
      },
        HttpStatus.BAD_REQUEST);
    }

    const hasJobTitles = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.jobTitles', 'jobTitles')
      .where('jobTitles.departmentId = :id', { id })
      .andWhere('jobTitles.deletedAt IS NULL')
      .getOne();

    if (hasJobTitles) {
      throw new HttpException({
        message: errorMessage['0005'],
        code: '0005',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  // async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
  //   const {id, name, color } = createDepartmentDto;

  //   await this.validateUniqueName(name);

  //   const department = this.departmentRepository.create({
  //     id,
  //     name,
  //     color,
  //   });
  //   await this.departmentRepository.save(department);
  //   return this.toDepartmentResponseDto(department);
  // }

  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentRepository.find({
      select: ['id', 'name', 'color'],
      order: { name: 'ASC' },
      take: 15,
    });

    return departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      color: dept.color,
    }));
  }


  async findOne(id: EDepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({
      select: ['id', 'name', 'color'],
      where: { id },
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }

    return department;
  }

  async update(id: EDepartmentId, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, color } = updateDepartmentDto;

    await this.validateUniqueName(name);

    const department = await this.departmentRepository.findOne({
      select: ['id', 'name', 'color'],
      where: { id },
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }

    department.name = name;
    department.color = color;

    await this.departmentRepository.save(department);
    return department;
  }

  // async remove(id: EDepartmentId): Promise<void> {
  //   await this.validateDepartmentId(id);
  //   await this.validateNoReferences(id);

  //   const department = await this.departmentRepository.findOne({
  //     select: ['id', 'deletedAt'],
  //     where: { id },
  //   });

  //   if (!department) {
  //     throw new HttpException({
  //       message: errorMessage['0001'],
  //       code: '0001',
  //     },
  //       HttpStatus.BAD_REQUEST);
  //   }

  //   await this.departmentRepository.softDelete(id);
  //   return;
  // }

  // async restoreDepartment(id: EDepartmentId) {
  //   await this.validateDepartmentId(id);

  //   const department = await this.departmentRepository.findOne({
  //     select: ['id', 'name', 'color', 'deletedAt'],
  //     where: { id },
  //     withDeleted: true,
  //   });

  //   if (!department) {
  //     throw new HttpException({
  //       message: errorMessage['0001'],
  //       code: '0001',
  //     },
  //       HttpStatus.BAD_REQUEST);
  //   }
  //   await this.departmentRepository.restore(id);

  //   return this.toDepartmentResponseDto(department);
  // }

  // async partialUpdate(id: EDepartmentId, partialData: Partial<UpdateDepartmentDto>): Promise<DepartmentResponseDto> {

  //   const department = await this.departmentRepository.findOne({
  //     select: ['id', 'name', 'color', 'deletedAt'],
  //     where: { id },
  //   });

  //   if (!department) {
  //     throw new HttpException({
  //       message: errorMessage['0001'],
  //       code: '0001',
  //     },
  //       HttpStatus.BAD_REQUEST);
  //   }

  //   if (partialData.name) {
  //     await this.validateUniqueName(partialData.name);
  //     department.name = partialData.name;
  //   }

  //   if (partialData.color) {
  //     department.color = partialData.color;
  //   }

  //   await this.departmentRepository.save(department);
  //   return this.toUpdateDepartmentResponseDto(department);
  // }

  //   async permanentlyDeleteDepartment(id: DepartmentId) {
  //     await this.validateDepartmentId(id);

  //     const department = await this.departmentRepository.findOne({
  //       where: { id },
  //     });

  //     if (!department) {
  //       throw new HttpException({
  //         message: errorMessage['0001'],
  //         code: '0001',
  //       },
  //         HttpStatus.BAD_REQUEST);
  //     }

  //     return this.departmentRepository.delete(id);
  //   }
}
