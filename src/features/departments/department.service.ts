import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { CreateDepartmentDto } from './dto/create.department.dto';
import { UpdateDepartmentDto } from './dto/update.department.dto';
import { DepartmentResponseDto } from './dto/department.response.dto';
import { EDepartmentId } from '@common/constants/department.enum';

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

  async validateDepartmentId(id: EDepartmentId) {
    const validIds = Object.values(EDepartmentId);
    if (!validIds.includes(id)) {
      throw new BadRequestException(`Invalid department ID: ${id}. Valid IDs are: ${validIds.join(', ')}`);
    }
  }

  async validateUniqueName(name: string) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name, deletedAt: null },
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

  async validateNoReferences(id: EDepartmentId): Promise<void> {
    // ตรวจสอบว่ามี user ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasUsers = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.users', 'users')
      .where('users.departmentId = :id', { id })
      .andWhere('users.deletedAt IS NULL')
      .getOne();

    if (hasUsers) {
      throw new BadRequestException('Cannot delete department that has users');
    }

    // ตรวจสอบว่ามี job title ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasJobTitles = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.jobTitles', 'jobTitles')
      .where('jobTitles.departmentId = :id', { id })
      .andWhere('jobTitles.deletedAt IS NULL')
      .getOne();

    if (hasJobTitles) {
      throw new BadRequestException('Cannot delete department that has job titles');
    }
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, color } = createDepartmentDto;

    await this.validateNameLength(name);
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


  async findOne(id: EDepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return this.toDepartmentResponseDto(department);
  }

  async update(id: EDepartmentId, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, color } = updateDepartmentDto;

    await this.validateDepartmentId(id);
    await this.validateNameLength(name);
    await this.validateUniqueName(name);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.name = name;
    department.color = color;
    department.updatedAt = new Date();

    await this.departmentRepository.save(department);
    return this.toDepartmentResponseDto(department);
  }

  async remove(id: EDepartmentId): Promise<void> {
    await this.validateDepartmentId(id);
    await this.validateNoReferences(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.deletedAt = new Date();
    await this.departmentRepository.save(department);
    return;
  }

  async restoreDepartment(id: EDepartmentId) {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.deletedAt = null;
    return this.toDepartmentResponseDto(await this.departmentRepository.save(department));
  }

  async partialUpdate(id: EDepartmentId, partialData: Partial<UpdateDepartmentDto>): Promise<DepartmentResponseDto> {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    // Update only the provided fields
    if (partialData.name) {
      await this.validateNameLength(partialData.name);
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
  //       throw new NotFoundException(`Department #${id} not found`);
  //     }

  //     return this.departmentRepository.delete(id);
  //   }
}
