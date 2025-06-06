import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entity/users.entity';
import { JobTitleEntity } from '../../database/entity/job-titles.entity';
import { DepartmentEntity } from '../../database/entity/departments.entity';
import { RoleEntity } from '../../database/entity/roles.entity';
import { CreateUserDto } from './dto/create.users.dto';
import { EJobTitleId } from '@common/constants/jobtitle.enum';
import { EDepartmentId } from '@common/constants/department.enum';
import { UpdateUserDto } from './dto/update.users.dto';
import { UserResponseDto } from './dto/users.respones.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>,
    @InjectRepository(JobTitleEntity)
    private jobTitleRepository: Repository<JobTitleEntity>,
    @InjectRepository(DepartmentEntity)
    private departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>
  ) { }

  toUserResponseDto(
    entity: UserEntity
  ): UserResponseDto {
    return {
      id: entity.id,
      employeeCode: entity.employeeCode,
      googleId: entity.googleId,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      nickName: entity.nickName,
      avatarUrl: entity.avatarUrl,
      birthDate: entity.birthDate,
      salary: entity.salary,
      roleId: entity.roleId,
      jobTitleId: entity.jobTitleId,
      departmentId: entity.departmentId,
      approvedBy: entity.approvedBy,
      approvedAt: entity.approvedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  async patchUser(id: string, updateData: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userInfoRepository.findOne({
      where: { id },
      relations: ['jobTitle', 'department', 'role']
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update only the provided fields
    if (updateData.email) user.email = updateData.email;
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.nickName) user.nickName = updateData.nickName;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;
    if (updateData.birthDate) user.birthDate = updateData.birthDate;
    if (updateData.jobTitleId) user.jobTitleId = updateData.jobTitleId;
    if (updateData.departmentId) user.departmentId = updateData.departmentId;
    if (updateData.roleId) user.roleId = updateData.roleId;
    if (updateData.salary) user.salary = updateData.salary;
    return await this.userInfoRepository.save(user);
  }

  private async validateUserId(id: string): Promise<void> {

    const user = await this.userInfoRepository.findOne({
      where: { id },
    });

    if (!user || user.deletedAt) {
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

    if (existingUser && !existingUser.deletedAt) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async validateRole(roleId: string): Promise<void> {

    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });

    if (!role || role.deletedAt) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
  }

  private async validateJobTitle(jobTitleId: EJobTitleId): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      where: { id: jobTitleId },
    });

    if (!jobTitle || jobTitle.deletedAt) {
      throw new NotFoundException(`Job title with ID ${jobTitleId} not found`);
    }
  }

  private async validateDepartment(departmentId: EDepartmentId): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });

    if (!department || department.deletedAt) {
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

  private async validateBirthDate(birthDate: string | Date): Promise<void> {
    if (!birthDate) {
      throw new BadRequestException('Birth date is required');
    }

    // Convert to Date if string
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid birth date format');
    }

    const today = new Date();
    const minAge = 18;
    const maxAge = 100;

    const age = today.getFullYear() - date.getFullYear();
    if (age < minAge || age > maxAge) {
      throw new BadRequestException(`Age must be between ${minAge} and ${maxAge} years`);
    }
  }

  async createUser(data: CreateUserDto): Promise<UserEntity> {
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

    const user = await this.userInfoRepository.save({
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
    return user;
  }

  async getUserById(id: string): Promise<UserEntity> {
    await this.validateUserId(id);

    const user = await this.userInfoRepository.findOne({
      where: { id }
    });
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.userInfoRepository.find({
      where: { deletedAt: null }
    });
    return users;
  }

  async updateUser(userId: string, data: UpdateUserDto): Promise<UserEntity> {
    await this.validateUserId(userId);

    const updateData: Partial<UserEntity> = {};

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
    if (data.nickName) updateData.nickName = data.nickName;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
    if (data.salary) updateData.salary = data.salary;


    const user = await this.userInfoRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    Object.assign(user, {
      ...updateData,
      updatedAt: new Date(),
    });

    return await this.userInfoRepository.save(user);
  }

  async deleteUser(id: string): Promise<UserEntity> {
    await this.validateUserId(id);

    const user = await this.userInfoRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.deletedAt = new Date();
    return await this.userInfoRepository.save(user);
  }
}
