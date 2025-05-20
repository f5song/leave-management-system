import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInfo, JobTitle, Department } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async validateUserId(id: number): Promise<void> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('User ID must be a positive integer');
    }

    const user = await this.prisma.userInfo.findUnique({
      where: { id },
    });

    if (!user || user.delete_time) {
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

    const existingUser = await this.prisma.userInfo.findUnique({
      where: { email },
    });

    if (existingUser && !existingUser.delete_time) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async validateRole(roleId: number): Promise<void> {
    if (!Number.isInteger(roleId) || roleId <= 0) {
      throw new BadRequestException('Role ID must be a positive integer');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role || role.delete_time) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }
  }

  private async validateJobTitle(jobTitleId: string): Promise<void> {
    if (!jobTitleId || typeof jobTitleId !== 'string' || jobTitleId.length > 20) {
      throw new BadRequestException('Job title ID must be a string with maximum length of 20 characters');
    }

    const jobTitle = await this.prisma.jobTitle.findUnique({
      where: { id: jobTitleId },
    });

    if (!jobTitle || jobTitle.delete_time) {
      throw new NotFoundException(`Job title with ID ${jobTitleId} not found`);
    }
  }

  private async validateDepartment(departmentId: string): Promise<void> {
    if (!departmentId || typeof departmentId !== 'string' || departmentId.length > 20) {
      throw new BadRequestException('Department ID must be a string with maximum length of 20 characters');
    }

    const department = await this.prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department || department.delete_time) {
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

  async createUser(data: CreateUserDto): Promise<UserInfo> {
    await this.validateEmail(data.email);
    await this.validateRole(data.role_id);
    await this.validateJobTitle(data.job_title_id);
    await this.validateDepartment(data.department_id);
    await this.validateNames(data.first_name, data.last_name);
    await this.validateBirthDate(data.birth_date);

    return await this.prisma.userInfo.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date,
        role_id: data.role_id,
        job_title_id: data.job_title_id,
        department_id: data.department_id,
      },
    });
  }

  async getUserById(id: number): Promise<UserInfo> {
    await this.validateUserId(id);
    
    return await this.prisma.userInfo.findUnique({
      where: { id },
    });
  }

  async getAllUsers(): Promise<UserInfo[]> {
    return await this.prisma.userInfo.findMany({
      where: { delete_time: null },
    });
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<UserInfo> {
    await this.validateUserId(userId);
    
    const updateData: Partial<UserInfo> = {};
    
    if (data.email) await this.validateEmail(data.email);
    if (data.role_id) await this.validateRole(data.role_id);
    if (data.job_title_id) await this.validateJobTitle(data.job_title_id);
    if (data.department_id) await this.validateDepartment(data.department_id);
    if (data.first_name || data.last_name) {
      await this.validateNames(
        data.first_name || (await this.getUserById(userId)).first_name,
        data.last_name || (await this.getUserById(userId)).last_name
      );
    }
    if (data.birth_date) await this.validateBirthDate(data.birth_date);

    if (data.email) updateData.email = data.email;
    if (data.first_name) updateData.first_name = data.first_name;
    if (data.last_name) updateData.last_name = data.last_name;
    if (data.birth_date) updateData.birth_date = data.birth_date;
    if (data.role_id) updateData.role_id = data.role_id;
    if (data.job_title_id) updateData.job_title_id = data.job_title_id;
    if (data.department_id) updateData.department_id = data.department_id;

    return await this.prisma.userInfo.update({
      where: { id: userId },
      data: updateData,
    });
  }

  async partialUpdateUser(id: number, partialData: Partial<UserInfo>): Promise<UserInfo> {
    await this.validateUserId(id);
    
    const existingUser = await this.getUserById(id);
    
    return await this.prisma.userInfo.update({
      where: { id },
      data: {
        ...partialData,
        id: existingUser.id,
      },
    });
  }

  async deleteUser(id: number): Promise<UserInfo> {
    await this.validateUserId(id);
    
    return await this.prisma.userInfo.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
