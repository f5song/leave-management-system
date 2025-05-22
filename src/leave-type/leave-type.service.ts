import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveTypeEntity } from '../database/entity/leave-type.entity';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './leave-type.validation';
import { LeaveTypeResponseDto } from './leave-type-response.dto';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectRepository(LeaveTypeEntity)
    private leaveTypeRepository: Repository<LeaveTypeEntity>,
  ) { }

  async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const existing = await this.leaveTypeRepository.findOne({
      where: { name: createLeaveTypeDto.name },
      withDeleted: true,
    });

    if (existing) {
      if (!existing.delete_time) {
        throw new BadRequestException(`Leave type with name '${createLeaveTypeDto.name}' already exists`);
      }
      throw new BadRequestException(`Leave type with name '${createLeaveTypeDto.name}' exists but was deleted`);
    }

    const leaveType = this.leaveTypeRepository.create(createLeaveTypeDto);
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  async findAll(): Promise<LeaveTypeResponseDto[]> {
    const leaveTypes = await this.leaveTypeRepository.find({
      where: { delete_time: null },
      order: { name: 'ASC' },
    });
    return leaveTypes.map(leaveType => this.toResponseDto(leaveType));
  }

  async findOne(id: number): Promise<LeaveTypeEntity> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: String(id), delete_time: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }

    return leaveType;
  }

  async update(id: number, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
    Object.assign(leaveType, updateLeaveTypeDto);
    leaveType.update_time = new Date();
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  async delete(id: number): Promise<void> {
    const leaveType = await this.findOne(id);
    leaveType.delete_time = new Date();
    await this.leaveTypeRepository.save(leaveType);
  }

  async restore(id: number): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: String(id), delete_time: null },
    });

    if (!leaveType) {
      throw new NotFoundException(`Deleted leave type with ID ${id} not found`);
    }

    leaveType.delete_time = null;
    await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(leaveType);
  }

  private async validateLeaveTypeExists(id: number): Promise<void> {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: String(id) },
      withDeleted: true,
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${id} not found`);
    }
  }

  async softDelete(id: number): Promise<void> {
    await this.validateLeaveTypeExists(id);

    await this.leaveTypeRepository.update(id, {
      delete_time: new Date()
    });
  }

  async partialUpdate(id: number, data: Partial<{ name: string; description: string; is_active: boolean }>): Promise<LeaveTypeResponseDto> {
    const leaveType = await this.findOne(id);
    Object.assign(leaveType, data);
    leaveType.update_time = new Date();
    const updatedLeaveType = await this.leaveTypeRepository.save(leaveType);
    return this.toResponseDto(updatedLeaveType);
  }

  private toResponseDto(leaveType: LeaveTypeEntity): LeaveTypeResponseDto {
    return {
      id: leaveType.id,
      name: leaveType.name,
      created_at: leaveType.created_at,
      update_time: leaveType.update_time,
      delete_time: leaveType.delete_time
  
    };
  }
}
