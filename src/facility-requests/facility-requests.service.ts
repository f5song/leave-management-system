import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacilityRequestEntity } from '../database/entity/users-facility-requests.entity';
import { CreateFacilityRequestDto, UpdateFacilityRequestDto, FacilityRequestResponseDto } from './facility-request.dto';

@Injectable()
export class FacilityRequestsService {
  constructor(
    @InjectRepository(FacilityRequestEntity)
    private readonly facilityRequestRepository: Repository<FacilityRequestEntity>,
  ) {}

  async create(createDto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    const facilityRequest = this.facilityRequestRepository.create(createDto);
    const savedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return FacilityRequestResponseDto.fromEntity(savedRequest);
  }

  async findOne(id: string): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.facilityRequestRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!facilityRequest) {
      throw new Error('Facility request not found');
    }
    return FacilityRequestResponseDto.fromEntity(facilityRequest);
  }

  async findAll(): Promise<FacilityRequestResponseDto[]> {
    const facilityRequests = await this.facilityRequestRepository.find({
      where: { deletedAt: null },
      order: { createdAt: 'DESC' },
    });
    return facilityRequests.map(entity => FacilityRequestResponseDto.fromEntity(entity));
  }

  async update(id: string, updateDto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.findOne(id);
    Object.assign(facilityRequest, updateDto);
    const updatedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return FacilityRequestResponseDto.fromEntity(updatedRequest);
  }

  async softDelete(id: string): Promise<FacilityRequestResponseDto> {
    const facilityRequest = await this.findOne(id);
    facilityRequest.deletedAt = new Date();
    const deletedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return FacilityRequestResponseDto.fromEntity(deletedRequest);
  }
}
