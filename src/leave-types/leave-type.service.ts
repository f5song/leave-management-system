import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from '../database/entity/leave-types.entity';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './leave-type.dto';
import { LeaveTypeResponseDto } from './leave-type.dto';
import { LeaveType } from 'src/constants/leave-type.enum';

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

  async findOne(id: LeaveType): Promise<LeaveTypeEntity> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id, deletedAt: null },
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
    leaveType.updatedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(leaveType);
  }

  async delete(id: LeaveType): Promise<void> {
    const leaveType = await this.findOne(id);
    leaveType.deletedAt = new Date();
    await this.leaveTypeRepository.save(leaveType);
  }

  async restore(id: LeaveType): Promise<LeaveTypeResponseDto> {
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
      deletedAt: new Date()
    });
  }

  async partialUpdate(id: LeaveType, data: Partial<{ name: string; description: string; is_active: boolean }>): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, data);
    leaveType.updatedAt = new Date();
    const updatedLeaveType = await this.leaveTypeRepository.save(leaveType);
    return this.toLeaveTypeResponseDto(updatedLeaveType);
  }
}
