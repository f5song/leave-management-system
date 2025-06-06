import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from '../../database/entity/leave-types.entity';
import { CreateLeaveTypeDto } from './dto/create.leave-types.dto';
import { LeaveTypeResponseDto } from './dto/leave-types.respones.dto';
import { ELeaveType } from '@common/constants/leave-type.enum';
import { UpdateLeaveTypeDto } from './dto/update.leave-types.dto';

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
      where: { id: createLeaveTypeDto.id },
      withDeleted: true,
    });

    if (existing) {
      if (!existing.deletedAt) {
        throw new BadRequestException(`Leave type with id '${createLeaveTypeDto.id}' already exists`);
      }
      throw new BadRequestException(`Leave type with id '${createLeaveTypeDto.id}' exists but was deleted`);
    }

    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });
    return leaveTypes.map(leaveType => this.toLeaveTypeResponseDto(leaveType));
  }

  async findOne(id: ELeaveType): Promise<LeaveTypeEntity> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id, deletedAt: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }

    return leaveType;
  }

  async update(id: ELeaveType, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
    Object.assign(leaveType, updateLeaveTypeDto);
    leaveType.updatedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async partialUpdate(id: ELeaveType, partialData: Partial<UpdateLeaveTypeDto>): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
    
    // Update only the provided fields
    Object.keys(partialData).forEach(key => {
      if (partialData[key] !== undefined) {
        leaveType[key] = partialData[key];
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
      where: { id, deletedAt: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Deleted leave type with ID ${id} not found`);
    }

    leaveType.deletedAt = null;
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  private async validateLeaveTypeExists(id: ELeaveType): Promise<void> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
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
