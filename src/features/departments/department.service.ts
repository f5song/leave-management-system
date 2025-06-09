import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { CreateDepartmentDto } from './dto/create.department.dto';
import { UpdateDepartmentDto } from './dto/update.department.dto';
import { DepartmentResponseDto } from './dto/department.response.dto';
import { EDepartmentId } from '@common/constants/department.enum';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>
  ) { }

  toDepartmentResponseDto(
    entity: DepartmentEntity
  ): DepartmentResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      color: entity.color,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      users: entity.users,
      jobTitles: entity.jobTitles,
    };
  }

  async validateDepartmentId(id: string) {
    const validIds = Object.values(id);
    if (!validIds.includes(id)) {
      throw new HttpException({
        message: errorMessage['0006'],
        code: '0006',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async validateUniqueName(name: string) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name, deletedAt: null },
    });
    if (existingDepartment) {
    throw new HttpException({
      message: errorMessage['0002'],
      code: '0002',
    },
      HttpStatus.BAD_REQUEST);
    }
  }


  async validateNoReferences(id: string): Promise<void> {
    // ตรวจสอบว่ามี user ที่อ้างอิงถึงแผนกนี้หรือไม่
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

    // ตรวจสอบว่ามี job title ที่อ้างอิงถึงแผนกนี้หรือไม่
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

  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, color } = createDepartmentDto;

    await this.validateUniqueName(name);

    const department = this.departmentRepository.create({
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    department.color = color;
    await this.departmentRepository.save(department);
    return this.toDepartmentResponseDto(department);
  }

  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
    const departmentPromises = departments.map(dept => this.toDepartmentResponseDto(dept));
    return Promise.all(departmentPromises);
  }


  async findOne(id: string): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }
    return this.toDepartmentResponseDto(department);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, color } = updateDepartmentDto;

    await this.validateDepartmentId(id);
    await this.validateUniqueName(name);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
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
    department.updatedAt = new Date();

    await this.departmentRepository.save(department);
    return this.toDepartmentResponseDto(department);
  }

  async remove(id: string): Promise<void> {
    await this.validateDepartmentId(id);
    await this.validateNoReferences(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }

    department.deletedAt = new Date();
    await this.departmentRepository.save(department);
    return;
  }

  async restoreDepartment(id: string) {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }

    department.deletedAt = null;
    return this.toDepartmentResponseDto(await this.departmentRepository.save(department));
  }

  async partialUpdate(id: string, partialData: Partial<UpdateDepartmentDto>): Promise<DepartmentResponseDto> {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!department) {
      throw new HttpException({
        message: errorMessage['0001'],
        code: '0001',
      },
        HttpStatus.BAD_REQUEST);
    }

    // Update only the provided fields
    if (partialData.name) {
      await this.validateUniqueName(partialData.name);
      department.name = partialData.name;
    }

    if (partialData.color) {
      department.color = partialData.color;
    }

    department.updatedAt = new Date();
    await this.departmentRepository.save(department);
    return this.toDepartmentResponseDto(department);
  }

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
