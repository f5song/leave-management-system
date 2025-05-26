import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from '../database/entity/leave-type.entity';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './leave-type.validation';
import { LeaveTypeResponseDto } from './leave-type-response.dto';
import { LeaveType } from 'src/constants/leave-type.enum';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveTypeEntity)
    private leaveTypeRepository: Repository<LeaveTypeEntity>,
  ) { }

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const existing = await this.leaveTypeRepository.findOne({
      where: { id: createLeaveTypeDto.id },
      withDeleted: true,
    });

    if (existing) {
      if (!existing.deleteTime) {
        throw new BadRequestException(`Leave type with id '${createLeaveTypeDto.id}' already exists`);
      }
      throw new BadRequestException(`Leave type with id '${createLeaveTypeDto.id}' exists but was deleted`);
    }

    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { deleteTime: null },
      order: { id: 'ASC' },
    });
    return leaveTypes.map(leaveType => this.toResponseDto(leaveType));
  }

  async findOne(id: LeaveType): Promise<LeaveTypeEntity> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id, deleteTime: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }

    return leaveType;
  }

  async update(id: LeaveType, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
    Object.assign(leaveType, updateLeaveTypeDto);
    leaveType.updateTime = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  async delete(id: LeaveType): Promise<void> {
    const leaveType = await this.findOne(id);
    leaveType.deleteTime = new Date();
    await this.leaveTypeRepository.save(leaveType);
  }

  async restore(id: LeaveType): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id, deleteTime: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Deleted leave type with ID ${id} not found`);
    }

    leaveType.deleteTime = null;
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  private async validateLeaveTypeExists(id: LeaveType): Promise<void> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
  }

  async softDelete(id: LeaveType): Promise<void> {
    await this.validateLeaveTypeExists(id);

    await this.leaveTypeRepository.update(id, {
      deleteTime: new Date()
    });
  }

  async partialUpdate(id: LeaveType, data: Partial<{ name: string; description: string; is_active: boolean }>): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, data);
    leaveType.updateTime = new Date();
    const updatedLeaveType = await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(updatedLeaveType);
  }

  private toResponseDto(leaveType: LeaveTypeEntity): LeaveTypeResponseDto {
    return {
      id: leaveType.id,
      name: leaveType.name,
      description: leaveType.description,
      createdAt: leaveType.createdAt,
      updateTime: leaveType.updateTime,
      deleteTime: leaveType.deleteTime
    };
  }
}
