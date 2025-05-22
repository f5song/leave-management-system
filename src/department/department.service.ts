import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { DepartmentEntity } from '../database/entity/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './department.validation';
import { DepartmentResponseDto } from './department-response.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>
  ) {}

  async validateDepartmentId(id: number) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid department ID format');
    }
  }

  async validateUniqueName(name: string) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name, delete_time: null },
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

  async validateNoReferences(id: number): Promise<void> {
    // ตรวจสอบว่ามี user ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasUsers = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.users', 'users')
      .where('users.department_id = :id', { id })
      .andWhere('users.delete_time IS NULL')
      .getOne();

    if (hasUsers) {
      throw new BadRequestException('Cannot delete department that has users');
    }

    // ตรวจสอบว่ามี job title ที่อ้างอิงถึงแผนกนี้หรือไม่
    const hasJobTitles = await this.departmentRepository
      .createQueryBuilder('department')
      .leftJoinAndSelect('department.jobTitles', 'jobTitles')
      .where('jobTitles.department_id = :id', { id })
      .andWhere('jobTitles.delete_time IS NULL')
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
      created_at: new Date(),
      update_time: new Date(),
    });

    await this.departmentRepository.save(department);
    return this.toResponseDto(department);
  }

  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentRepository.find({
      where: { delete_time: null },
      order: { name: 'ASC' },
    });
    return departments.map(dept => this.toResponseDto(dept));
  }
  toResponseDto(dept: DepartmentEntity): any {
    return {
      id: dept.id,
      name: dept.name,
      created_at: dept.created_at,
      update_time: dept.update_time,
    };
  }

  async findOne(id: number): Promise<DepartmentResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id, delete_time: null },
    });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return this.toResponseDto(department);
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {
    const { name, description } = updateDepartmentDto;

    await this.validateDepartmentId(id);
    await this.validateNameLength(name);
    await this.validateUniqueName(name);

    const department = await this.departmentRepository.findOne({
      where: { id, delete_time: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.name = name;
    department.update_time = new Date();

    await this.departmentRepository.save(department);
    return this.toResponseDto(department);
  }

  async remove(id: number): Promise<void> {
    await this.validateDepartmentId(id);
    await this.validateNoReferences(id);

    const department = await this.departmentRepository.findOne({
      where: { id, delete_time: null },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.delete_time = new Date();
    await this.departmentRepository.save(department);
    return;
  }

  async restoreDepartment(id: number) {
    await this.validateDepartmentId(id);

    const department = await this.departmentRepository.findOne({
      where: { id, delete_time: Not(IsNull()) },
    });

    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }

    department.delete_time = null;
    return this.departmentRepository.save(department);
  }

  async permanentlyDeleteDepartment(id: number) {
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
