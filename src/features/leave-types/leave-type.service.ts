import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from '../../database/entity/leave-types.entity';
import { CreateLeaveTypeDto } from './dto/create.leave-types.dto';
import { LeaveTypeResponseDto } from './respones/leave-types.respones.dto';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { UpdateLeaveTypeDto } from './dto/update.leave-types.dto';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveTypeEntity)
    private leaveTypeRepository: Repository<LeaveTypeEntity>,
  ) { }

  toLeaveTypeResponseDto(
        entity: LeaveTypeEntity
      ): LeaveTypeResponseDto {
      return {
        id: entity.id,
        name: entity.name,
        leaves: entity.leaves,
        description: entity.description,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const existing = await this.leaveTypeRepository.findOne({
      select: ['id'],
      where: { id: createLeaveTypeDto.id },
      withDeleted: true,
    });

    if (existing) {
      if (!existing.deletedAt) {
        throw new HttpException({
          code: '0302',
          message: errorMessage['0302'],
          statusCode: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException({
        code: '0303',
        message: errorMessage['0303'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeRepository.find({
      select: ['id', 'name', 'leaves', 'description'],
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });
    return leaveTypes.map(leaveType => this.toLeaveTypeResponseDto(leaveType));
  }

  async findOne(id: ELeaveType): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeRepository.findOne({
      select: ['id', 'name', 'leaves', 'description'],
      where: { id, deletedAt: null },
    });

    if (!leaveType) {
      throw new HttpException({
        code: '0301',
        message: errorMessage['0301'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }

    return this.toLeaveTypeResponseDto(leaveType);
  }

  async update(id: ELeaveType, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new HttpException({
        code: '0301',
        message: errorMessage['0301'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    Object.assign(leaveType, updateLeaveTypeDto);
    leaveType.updatedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async partialUpdate(id: ELeaveType, partialData: Partial<UpdateLeaveTypeDto>): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new HttpException({
        code: '0301',
        message: errorMessage['0301'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    
    // Update only the provided fields
    Object.keys(partialData).forEach(key => {
      if (partialData[key] !== undefined) {
        (leaveType as any)[key] = partialData[key];
      }
    });
    
    leaveType.updatedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async delete(id: ELeaveType): Promise<void> {
    const leaveType = await this.findOne(id);
    leaveType.deletedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
  }

  async restore(id: ELeaveType): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeRepository.findOne({
      select: ['id', 'name', 'leaves', 'description', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id, deletedAt: null },
    });

    if (!leaveType) {
      throw new HttpException({
        code: '0301',
        message: errorMessage['0301'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }

    leaveType.deletedAt = null;
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  private async validateLeaveTypeExists(id: ELeaveType): Promise<void> {
    const leaveType = await this.leaveTypeRepository.findOne({
      select: ['id'],
      where: { id },
      withDeleted: true,
    });

    if (!leaveType) {
      throw new HttpException({
        code: '0301',
        message: errorMessage['0301'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
  }

  async softDelete(id: ELeaveType): Promise<void> {
    await this.validateLeaveTypeExists(id);

    await this.leaveTypeRepository.update(id, {
      deletedAt: new Date()
    });
  }

  // async partialUpdate(id: LeaveType, data: Partial<{ name: string; description: string; is_active: boolean }>): Promise<LeaveTypeResponseDto> {
  //   const leaveType = await this.findOne(id);
  //   Object.assign(leaveType, data);
  //   leaveType.updatedAt = new Date();
  //   const updatedLeaveType = await this.leaveTypeRepository.save(leaveType);
  //   return this.toLeaveTypeResponseDto(updatedLeaveType);
  // }
}
