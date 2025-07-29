import { Injectable, NotFoundException, BadRequestException, HttpStatus, HttpException } from '@nestjs/common';
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
import { UserResponseDto } from './respones/users.respones.dto';
import { ERole } from '@src/common/constants/roles.enum';
import { errorMessage } from '@src/common/constants/error-message';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
export class UserService {
  constructor(
    private awsS3Service: AwsS3Service,
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

  // async patchUser(id: string, updateData: UpdateUserDto): Promise<UserResponseDto> {
  //   const user = await this.userInfoRepository.findOne({
  //     select: ['id', 'email', 'firstName', 'lastName', 'nickName', 'avatarUrl', 'birthDate', 'salary', 'roleId', 'jobTitleId', 'departmentId', 'approvedBy', 'approvedAt', 'createdAt', 'updatedAt', 'deletedAt'],
  //     where: { id },
  //     relations: ['jobTitle', 'department', 'role']
  //   });

  //   if (!user) {
  //     throw new HttpException({
  //       code: '0701',
  //       message: errorMessage['0701'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }

  //   // Update only the provided fields
  //   if (updateData.email) user.email = updateData.email;
  //   if (updateData.firstName) user.firstName = updateData.firstName;
  //   if (updateData.lastName) user.lastName = updateData.lastName;
  //   if (updateData.nickName) user.nickName = updateData.nickName;
  //   if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;
  //   if (updateData.birthDate) user.birthDate = updateData.birthDate;
  //   if (updateData.jobTitleId) user.jobTitleId = updateData.jobTitleId;
  //   if (updateData.departmentId) user.departmentId = updateData.departmentId;
  //   if (updateData.roleId) user.roleId = updateData.roleId;
  //   if (updateData.salary) user.salary = updateData.salary;
  //   return this.toUserResponseDto(await this.userInfoRepository.save(user));
  // }

  async validateUserId(id: string): Promise<void> {

    const user = await this.userInfoRepository.findOne({
      select: ['id'],
      where: { id },
    });

    if (!user || user.deletedAt) {
      throw new HttpException({
        code: '0701',
        // message: errorMessage['0701'],
        message: "User not found in validateUserId",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateEmail(email: string): Promise<void> {
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      throw new HttpException({
        code: '0701',
        // message: errorMessage['0701'],
        message: "User not found in EMAIL",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (!email.includes('@')) {
      throw new HttpException({
        code: '0701',
        message: errorMessage['0701'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userInfoRepository.findOne({
      select: ['id'],
      where: { email },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new HttpException({
        code: '0706',
        message: errorMessage['0706'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateRole(roleId: ERole): Promise<void> {

    const role = await this.roleRepository.findOne({
      select: ['id'],
      where: { id: roleId },
    });

    if (!role || role.deletedAt) {
      throw new HttpException({
        code: '0701',
        message: "User not found in validateRole",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateJobTitle(jobTitleId: EJobTitleId): Promise<void> {
    const jobTitle = await this.jobTitleRepository.findOne({
      select: ['id'],
      where: { id: jobTitleId },
    });

    if (!jobTitle || jobTitle.deletedAt) {
      throw new HttpException({
        code: '0701',
        message: "User not found in validateJobTitle",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateDepartment(departmentId: EDepartmentId): Promise<void> {
    const department = await this.departmentRepository.findOne({
      select: ['id'],
      where: { id: departmentId },
    });

    if (!department || department.deletedAt) {
      throw new HttpException({
        code: '0701',
        message: "User not found in validateDepartment",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateNames(firstName: string, lastName: string): Promise<void> {
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      throw new HttpException({
        code: '0701',
        message: "User not found in validateNames",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      throw new HttpException({
        code: '0701',
        message: "User not found in validateNames",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateBirthDate(birthDate: string | Date): Promise<void> {

    // Convert to Date if string
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    if (isNaN(date.getTime())) {
      throw new HttpException({
        code: '0707', 
        message: errorMessage['0707'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    // const today = new Date();
    // const minAge = 18;
    // const maxAge = 100;

    // const age = today.getFullYear() - date.getFullYear();
    // if (age < minAge || age > maxAge) {
    //   throw new HttpException({
    //     code: '0701',
    //     message: errorMessage['0701'],
    //     statusCode: HttpStatus.BAD_REQUEST,
    //   }, HttpStatus.BAD_REQUEST);
    // }
  }

  async create(data: CreateUserDto, file?: Express.Multer.File): Promise<UserEntity> {
    if(data.email){
      await this.validateEmail(data.email);
    }
    if(data.roleId){
      await this.validateRole(data.roleId);
    }
    if(data.jobTitleId){
      await this.validateJobTitle(data.jobTitleId);
    }
    if(data.departmentId){
      await this.validateDepartment(data.departmentId);
    }
    if(data.firstName && data.lastName){
      await this.validateNames(data.firstName, data.lastName);
    }
 
    

    if(data.birthDate){
      await this.validateBirthDate(data.birthDate);
    }

    let avatar: string | null = null;
    if (file) {
      const result = await this.awsS3Service.uploadFile('profile', file);
      avatar = result?.Location; 
    }

    let nextNumber = 1;
    const last_user = await this.userInfoRepository.findOne({
      select: ['id', 'employeeCode'],
      where: { deletedAt: null },
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
      googleId: data.googleId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      nickName: data.nickName,
      avatarUrl: avatar,
      birthDate: data.birthDate,
      salary: data.salary,
      roleId: data.roleId,
      jobTitleId: data.jobTitleId,
      departmentId: data.departmentId,
      createdAt: new Date(),
    });

    await this.userInfoRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    await this.validateUserId(id);

    const user = await this.userInfoRepository.findOne({
      where: { id }
    });
    return this.toUserResponseDto(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userInfoRepository.find({
      where: { deletedAt: null }
    });
    return users.map(user => this.toUserResponseDto(user));
  }

  async update(userId: string, data: UpdateUserDto): Promise<UserResponseDto> {
    console.log("update user: ", userId);
    await this.validateUserId(userId);

    // ตรวจสอบค่าใหม่ที่ส่งมาทั้งหมด
    if(data.email){
      await this.validateEmail(data.email);
    }
    if(data.firstName && data.lastName){
      await this.validateNames(data.firstName, data.lastName);
    }
    if(data.birthDate){
      await this.validateBirthDate(data.birthDate);
    }
    if(data.roleId){
      await this.validateRole(data.roleId);
    }
    if(data.jobTitleId){
      await this.validateJobTitle(data.jobTitleId);
    }
    if(data.departmentId){
      await this.validateDepartment(data.departmentId);
    }

    const user = await this.userInfoRepository.findOne({
      select: [
        'id'
      ],
      where: { id: userId },
    });

    console.log("update user: ", user);

    if (!user) {
      throw new HttpException({
        code: '0701',
        message: errorMessage['0701'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    // เซตค่าทุก field ที่จำเป็นเสมอ (null ถ้าไม่ได้ส่งมา)
    Object.assign(user, {
      email: data.email ?? null,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      birthDate: data.birthDate ?? null,
      roleId: data.roleId ?? null,
      jobTitleId: data.jobTitleId ?? null,
      departmentId: data.departmentId ?? null,
      nickName: data.nickName ?? null,
      // avatarUrl: data.avatarUrl ?? null,
      salary: data.salary ?? null,
      updatedAt: new Date(),
    });

    return this.toUserResponseDto(await this.userInfoRepository.save(user));
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    await this.validateUserId(id);

    const user = await this.userInfoRepository.findOne({
      select: ['id', 'employeeCode', 'email', 'firstName', 'lastName', 'nickName', 'avatarUrl', 'birthDate', 'salary', 'roleId', 'jobTitleId', 'departmentId', 'approvedBy', 'approvedAt', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id },
    });

    if (!user) {
      throw new HttpException({
        code: '0701',
        message: "User not found in deleteUser",
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    user.deletedAt = new Date();
    return this.toUserResponseDto(await this.userInfoRepository.save(user));
  }

  async findByIdWithPermissions(id: string): Promise<UserEntity> {
    return this.userInfoRepository.findOne({
      where: { id: id },
      relations: ['role', 'role.permissionRoles', 'role.permissionRoles.permission'],
    });
  }

  async getAllBirthDate(): Promise<UserEntity[]> {
    return this.userInfoRepository.find({
      select: ['id', 'birthDate','nickName','firstName','lastName'],
    });
  }

}
