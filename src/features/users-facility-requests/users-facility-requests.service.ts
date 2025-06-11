import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersFacilityRequestEntity } from '../../database/entity/users-facility-requests.entity';
import { CreateFacilityRequestDto } from './dto/create.users-facility-requests.dto';
import { UpdateFacilityRequestDto } from './dto/update.users-facility-requests.dto';
import { FacilityRequestResponseDto } from './respones/users-facility-requests.repones.dto';

@Injectable()

export class FacilityRequestsService {
  toFacilityRequestResponseDto(
    entity: UsersFacilityRequestEntity
  ): FacilityRequestResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      requestedById: entity.requestedById,
      status: entity.status,
      approvedById: entity.approvedById,
      approvedAt: entity.approvedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }
  constructor(
    @InjectRepository(UsersFacilityRequestEntity)
    private readonly facilityRequestRepository: Repository<UsersFacilityRequestEntity>,
  ) {}

  async create(createDto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    const facilityRequest = this.facilityRequestRepository.create(createDto);
    const savedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return this.toFacilityRequestResponseDto(savedRequest);
  }

  async findOne(id: string): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.facilityRequestRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!facilityRequest) {
      throw new Error('Facility request not found');
    }
    return this.toFacilityRequestResponseDto(facilityRequest);
  }

  async findAll(): Promise<FacilityRequestResponseDto[]> {
    const facilityRequests = await this.facilityRequestRepository.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
    });
    return facilityRequests.map(entity => this.toFacilityRequestResponseDto(entity));
  }

  async update(id: string, updateDto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.findOne(id);
    Object.assign(facilityRequest, updateDto);
    const updatedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return this.toFacilityRequestResponseDto(updatedRequest);
  }

  async softDelete(id: string): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.findOne(id);
    facilityRequest.deletedAt = new Date();
    const deletedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return this.toFacilityRequestResponseDto(deletedRequest);
  }
}
