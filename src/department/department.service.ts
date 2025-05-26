import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DepartmentEntity } from '../database/entity/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.validation';
import { DepartmentResponseDto } from './department-response.dto';
import { DepartmentId } from 'src/constants/department.enum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>
  ) {}

  async validateDepartmentId(id: string) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException('Invalid department ID format');
    }
  }

  async validateUniqueName(name: string) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name, deleteTime: null },
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
    const hasUsers = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.users', 'users')
      .where('users.departmentId = :id', { id })
      .andWhere('users.deleteTime IS NULL')
      .getOne();

    if (hasUsers) {
      throw new BadRequestException('Cannot delete department that has users');
    }

    // ตรวจสอบว่ามี job title ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasJobTitles = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.jobTitles', 'jobTitles')
      .where('jobTitles.departmentId = :id', { id })
      .andWhere('jobTitles.deleteTime IS NULL')
      .getOne();

    if (hasJobTitles) {
      throw new BadRequestException('Cannot delete department that has job titles');
    }
  }

  async create(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, description } = createDepartmentDto;

    await this.validateNameLength(name);
    await this.validateUniqueName(name);

    const department = this.departmentRepository.create({
      name,
      createdAt: new Date(),
      updateTime: new Date(),
    });

    await this.departmentRepository.save(department);
    return this.toResponseDto(department);
  }

  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentRepository.find({
      where: { deleteTime: null },
      order: { name: 'ASC' },
    });
    return departments.map(dept => this.toResponseDto(dept));
  }
  toResponseDto(dept: DepartmentEntity): any {
    return {
      id: dept.id,
      name: dept.name,
      createdAt: dept.createdAt,
      updateTime: dept.updateTime,
    };
  }

  async findOne(id: DepartmentId): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id, deleteTime: null },
    });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return this.toResponseDto(department);
  }

  async update(id: DepartmentId, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, description } = updateDepartmentDto;

    await this.validateDepartmentId(id);
    await this.validateNameLength(name);
    await this.validateUniqueName(name);

    const department = await this.departmentRepository.findOne({
      where: { id, deleteTime: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.name = name;
    department.updateTime = new Date();

    await this.departmentRepository.save(department);
    return this.toResponseDto(department);
  }

  async remove(id: DepartmentId): Promise<void> {
    await this.validateDepartmentId(id);
    await this.validateNoReferences(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deleteTime: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.deleteTime = new Date();
    await this.departmentRepository.save(department);
    return;
  }

  async restoreDepartment(id: DepartmentId) {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, deleteTime: Not(IsNull()) },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.deleteTime = null;
    return this.departmentRepository.save(department);
  }

  async permanentlyDeleteDepartment(id: DepartmentId) {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    return this.departmentRepository.delete(id);
  }
}
