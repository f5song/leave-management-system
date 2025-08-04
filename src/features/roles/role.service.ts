import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../database/entity/roles.entity';
import { UserEntity } from '../../database/entity/users.entity';
import { CreateRoleDto } from './dto/create.roles.dto';
import { UpdateRoleDto } from './dto/update.roles.dto';
import { RoleResponseDto } from './respones/roles.respones.dto';
import { ERole } from '@src/common/constants/roles.enum';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>
  ) { }

  toRoleResponseDto(entity: RoleEntity): RoleResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      createdById: entity.createdById,
      createdBy: entity.createdBy,
      user: entity.user,
      permissions: entity.permissionRoles?.map(p => p.permission) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  private async validateRoleId(id: ERole): Promise<void> {
    try {
    const role = await this.roleRepository.findOne({
      select: ['id'],
      where: { id },
    });

    if (!role || role.deletedAt) {
      throw new HttpException({
        code: '0601',
        message: errorMessage['0601'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
    } catch (error) {
      throw new HttpException({
        code: '0601',
        message: errorMessage['0601'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // private async validateRoleName(name: string): Promise<void> {
  //   if (!name || typeof name !== 'string' || name.trim().length === 0) {
  //     throw new HttpException({
  //       code: '0606',
  //       message: errorMessage['0606'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }

  //   const existingRole = await this.roleRepository.findOne({
  //     select: ['id'],
  //     where: {
  //       name: name.trim(),
  //       deletedAt: null,
  //     },
  //   });

  //   if (existingRole) {
  //     throw new HttpException({
  //       code: '0601',
  //       message: errorMessage['0601'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }
  // }

  // private async validateRoleCreator(creatorId: string): Promise<void> {
  //   const user = await this.userInfoRepository.findOne({
  //     select: ['id'],
  //     where: { id: creatorId },
  //   });

  //   if (!user || user.deletedAt) {
  //     throw new HttpException({
  //       code: '0605',
  //       message: errorMessage['0605'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }
  // }

  async findAll(): Promise<RoleResponseDto[]> {
    try {
    const roles = await this.roleRepository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
      relations: ['createdBy', 'user', 'permissionRoles', 'permissionRoles.permission'],
    });

    return roles.map(role => this.toRoleResponseDto(role));
    } catch (error) {
      throw new HttpException({
        code: '0601',
        message: errorMessage['0601'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async findOne(id: ERole): Promise<RoleResponseDto> {
    try {
    await this.validateRoleId(id);
    const role = await this.roleRepository.findOne({
      select: ['id', 'name', 'createdById', 'createdBy', 'user', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id, deletedAt: null },
      relations: ['createdBy', 'user', 'permissionRoles', 'permissionRoles.permission'],
    });
    if (!role) {
      throw new HttpException({
        code: '0601',
        message: errorMessage['0601'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
    return role;
    } catch (error) {
      throw new HttpException({
        code: '0601',
        message: errorMessage['0601'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // async create(data: CreateRoleDto): Promise<RoleEntity> {
  //   await this.validateRoleName(data.name);
  //   await this.validateRoleCreator(data.createdBy);

  //   const user = await this.userInfoRepository.findOne({
  //     select: ['id'],
  //     where: { id: data.createdBy },
  //   });

  //   if (!user) {
  //     throw new HttpException({
  //       code: '0605',
  //       message: errorMessage['0605'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }

  //   return this.roleRepository.save({
  //     name: data.name,
  //     createdById: data.createdBy,
  //     createdBy: user,
  //   });
  // }


  // async update(id: ERole, data: UpdateRoleDto): Promise<RoleResponseDto> {
  //   await this.validateRoleId(id);

  //   if (data.name) {
  //     await this.validateRoleName(data.name);
  //   }

  //   const role = await this.roleRepository.findOne({
  //     select: ['id', 'name', 'createdById', 'createdBy', 'user', 'createdAt', 'updatedAt', 'deletedAt'],
  //     where: { id },
  //     relations: ['createdBy', 'user', 'permissionRoles', 'permissionRoles.permission'],
  //   });

  //   if (!role || role.deletedAt) {
  //     throw new HttpException({
  //       code: '0605',
  //       message: errorMessage['0605'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }

  //   Object.assign(role, {
  //     ...data,
  //     updateTime: new Date(),
  //   });

  //   return this.roleRepository.save(role);
  // }

  // async remove(id: ERole): Promise<RoleEntity> {
  //   await this.validateRoleId(id);

  //   const role = await this.roleRepository.findOne({
  //     select: ['id', 'name', 'createdById', 'createdBy', 'user', 'createdAt', 'updatedAt', 'deletedAt'],
  //     where: { id },
  //     relations: ['createdBy', 'user', 'permissionRoles', 'permissionRoles.permission'],
  //   });

  //   if (!role || role.deletedAt) {
  //     throw new HttpException({
  //       code: '0605',
  //       message: errorMessage['0605'],
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     }, HttpStatus.BAD_REQUEST);
  //   }

  //   role.deletedAt = new Date();
  //   return this.roleRepository.save(role);
  // }
}
