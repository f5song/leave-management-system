import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from '../../database/entity/permissions.entity';
import { CreatePermissionDto } from './dto/create.permissions.dto';
import { PermissionResponseDto } from './respones/permissions.respones.dto';
import { UserEntity } from '../../database/entity/users.entity';
import { UpdatePermissionDto } from './dto/update.permissions.dto';
import { EPermission } from '@src/common/constants/permission.enum';
import { ERole } from '@src/common/constants/roles.enum';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserEntity)
    private userInfoRepository: Repository<UserEntity>
  ) { }

  toPermissionResponseDto(
        entity: PermissionEntity
      ): PermissionResponseDto {
      return {
        id: entity.id,
        name: entity.name,
        permissionRoles: entity.permissionRoles,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }

  private async validatePermissionId(id: EPermission): Promise<void> {

    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: ['createdBy']
    });

    if (!permission || permission.deletedAt) {
      throw new HttpException({
        code: '0502',
        message: errorMessage['0502'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validatePermissionName(name: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        name: name.trim(),
        deletedAt: null
      }
    });

    if (existingPermission) {
      throw new HttpException({
        code: '0502',
        message: errorMessage['0502'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  private async validatePermissionCreatedById(creatorId: string): Promise<void> {

    const user = await this.userInfoRepository.findOne({
      where: { id: creatorId }
    });

    if (!user || user.deletedAt) {
      throw new  HttpException({
        code: '0502',
        message: errorMessage['0502'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async create(dto: CreatePermissionDto) {
    // Validate permission name and creator ID
    await this.validatePermissionName(dto.name);
    await this.validatePermissionCreatedById(dto.createdById);

    // Fetch the user who's creating this permission
    const user = await this.userInfoRepository.findOne({
      where: { id: dto.createdById },
      relations: ['createdPermissions']
    });

    // Create new permission with the DTO data and set the creator
    const permission = this.permissionRepository.create({
      ...dto,
      createdById: user.id
    });

    // Save the new permission to the database
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return this.permissionRepository.find({
      select: ['id', 'name', 'permissionRoles', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { deletedAt: null },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: EPermission) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      select: ['id', 'name', 'permissionRoles', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id },
      relations: ['createdBy']
    });
  }

  async update(id: EPermission, dto: UpdatePermissionDto) {
    await this.validatePermissionId(id);

    if (dto.name) {
      await this.validatePermissionName(dto.name);
    }

    const permission = await this.permissionRepository.findOne({
      select: ['id'],
      where: { id }
    });

    if (!permission || permission.deletedAt) {
      throw new HttpException({
        code: '0502',
        message: errorMessage['0502'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    Object.assign(permission, dto);
    permission.updatedAt = new Date();

    return await this.permissionRepository.save(permission);
  }

  async softDelete(id: EPermission) {
    await this.validatePermissionId(id);

    const permission = await this.permissionRepository.findOne({
      select: ['id', 'deletedAt'],
      where: { id }
    });

    if (!permission || permission.deletedAt) {
      throw new HttpException({
        code: '0502',
        message: errorMessage['0502'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    permission.deletedAt = new Date();
    return await this.permissionRepository.save(permission);
  }

  async getPermissionById(id: EPermission) {
    await this.validatePermissionId(id);
    return this.permissionRepository.findOne({
      select: ['id'],
      where: { id },
      relations: ['createdBy']
    });
  }

  async getPermissionsByRole(roleId: ERole) {
    return this.permissionRepository.createQueryBuilder('permission')
      .leftJoinAndSelect('permission.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .andWhere('role.deletedAt IS NULL')
      .andWhere('permission.deletedAt IS NULL')
      .getMany();
  }
}
