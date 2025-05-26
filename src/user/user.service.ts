import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoEntity } from '../database/entity/user-info.entity';
import { JobTitleEntity } from '../database/entity/job-title.entity';
import { DepartmentEntity } from '../database/entity/department.entity';
import { RoleEntity } from '../database/entity/role.entity';
import { CreateUserDto, UpdateUserDto } from './user.validation';
import { JobTitleId } from 'src/constants/jobtitle.enum';
import { DepartmentId } from 'src/constants/department.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private userInfoRepository: Repository<UserInfoEntity>,
    @InjectRepository(JobTitleEntity)
    private jobTitleRepository: Repository<JobTitleEntity>,
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>
  ) {}

  private async validateUserId(id: string): Promise<void> {

    const user = await this.userInfoRepository.findOne({
      where: { id },
    });

    if (!user || user.deleteTime) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  private async validateEmail(email: string): Promise<void> {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      throw new BadRequestException('Email is required and cannot be empty');
    }

    if (!email.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    const existingUser = await this.userInfoRepository.findOne({
      where: { email },
    });

    if (existingUser && !existingUser.deleteTime) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async validateRole(roleId: string): Promise<void> {

    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role || role.deleteTime) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
  }

  private async validateJobTitle(jobTitleId: JobTitleId): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id: jobTitleId },
    });

    if (!jobTitle || jobTitle.deleteTime) {
      throw new NotFoundException(`Job title with ID ${jobTitleId} not found`);
    }
  }

  private async validateDepartment(departmentId: DepartmentId): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department || department.deleteTime) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }
  }

  private async validateNames(firstName: string, lastName: string): Promise<void> {
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      throw new BadRequestException('First name is required and cannot be empty');
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      throw new BadRequestException('Last name is required and cannot be empty');
    }
  }

  private async validateBirthDate(birthDate: Date): Promise<void> {
    if (!birthDate) {
      throw new BadRequestException('Birth date is required');
    }

    const today = new Date();
    const minAge = 18;
    const maxAge = 100;

    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < minAge || age > maxAge) {
      throw new BadRequestException(`Age must be between ${minAge} and ${maxAge} years`);
    }
  }

  async createUser(data: CreateUserDto): Promise<UserInfoEntity> {
    await this.validateEmail(data.email);
    await this.validateRole(data.roleId);
    await this.validateJobTitle(data.jobTitleId);
    await this.validateDepartment(data.departmentId);
    await this.validateNames(data.firstName, data.lastName);
    await this.validateBirthDate(data.birthDate);


    let nextNumber = 1;
    const last_user = await this.userInfoRepository.findOne({
      order: {
        createdAt: 'DESC'
      }
    });
    if (last_user) {
      nextNumber = parseInt(last_user.employeeCode.split('-')[1]) + 1;
    }
    const paddedNumber = nextNumber.toString().padStart(3, '0');

    const user = this.userInfoRepository.create({
      employeeCode: `fh-${paddedNumber}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      roleId: data.roleId,
      jobTitleId: data.jobTitleId,
      departmentId: data.departmentId,
      createdAt: new Date(),
    });
    return this.userInfoRepository.save(user);
  }

  async getUserById(id: string): Promise<UserInfoEntity> {
    await this.validateUserId(id);
    
    return await this.userInfoRepository.findOne({
      where: { id },
      relations: ['role', 'jobTitle', 'department']
    });
  }

  async getAllUsers(): Promise<UserInfoEntity[]> {
    return await this.userInfoRepository.find({
      where: { deleteTime: null },
      relations: ['role', 'jobTitle', 'department']
    });
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserInfoEntity> {
    await this.validateUserId(userId);
    
    const updateData: Partial<UserInfoEntity> = {};
    
    if (data.email) await this.validateEmail(data.email);
    if (data.roleId) await this.validateRole(data.roleId);
    if (data.jobTitleId) await this.validateJobTitle(data.jobTitleId);
    if (data.departmentId) await this.validateDepartment(data.departmentId);
    if (data.firstName || data.lastName) {
      await this.validateNames(
        data.firstName || (await this.getUserById(userId)).firstName,
        data.lastName || (await this.getUserById(userId)).lastName
      );
    }
    if (data.birthDate) await this.validateBirthDate(data.birthDate);

    if (data.email) updateData.email = data.email;
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.birthDate) updateData.birthDate = data.birthDate;
    if (data.roleId) updateData.roleId = data.roleId;
    if (data.jobTitleId) updateData.jobTitleId = data.jobTitleId;
    if (data.departmentId) updateData.departmentId = data.departmentId;

    const user = await this.userInfoRepository.findOne({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    Object.assign(user, {
      ...updateData,
      updateTime: new Date(),
    });
    
    return this.userInfoRepository.save(user);
  }

  async partialUpdateUser(id: string, partialData: Partial<UserInfoEntity>): Promise<UserInfoEntity> {
    await this.validateUserId(id);
    
    const existingUser = await this.getUserById(id);
    
    const user = await this.userInfoRepository.findOne({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, {
      ...partialData,
      updateTime: new Date(),
    });
    
    return this.userInfoRepository.save(user);
  }

  async deleteUser(id: string): Promise<UserInfoEntity> {
    await this.validateUserId(id);
    
    const user = await this.userInfoRepository.findOne({
      where: { id },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.deleteTime = new Date();
    return this.userInfoRepository.save(user);
  }
}
