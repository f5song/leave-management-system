import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersFacilityRequestEntity } from '../../database/entity/users-facility-requests.entity';
import { CreateFacilityRequestDto } from './dto/create.users-facility-requests.dto';
import { UpdateFacilityRequestDto } from './dto/update.users-facility-requests.dto';
import { FacilityRequestResponseDto } from './respones/users-facility-requests.repones.dto';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { errorMessage } from '@src/common/constants/error-message';
import { EFacilityStatus } from '@common/constants/facility-status.enum';

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
  ) { }

  async create(userId: string, createDto: CreateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    const facilityRequest = this.facilityRequestRepository.create({
      ...createDto,
      requestedById: userId,
      status: EFacilityStatus.PENDING,
    });

    const saved = await this.facilityRequestRepository.save(facilityRequest);

    return this.toFacilityRequestResponseDto(saved);
  }


  async findOne(id: string): Promise<FacilityRequestResponseDto> {
    try {
    const facilityRequest = await this.facilityRequestRepository.findOne({
      select: ['id', 'title', 'description', 'requestedById', 'status', 'approvedById', 'approvedAt', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { id },
    });
    if (!facilityRequest) {
      throw new HttpException({
        code: '0801',
        message: errorMessage['0801'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    return this.toFacilityRequestResponseDto(facilityRequest);
  } catch (error) {
    throw new HttpException({
      code: '0801',
      message: errorMessage['0801'],
      statusCode: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND);
  }
}

  async findAll(): Promise<FacilityRequestResponseDto[]> {
    try {
    const facilityRequests = await this.facilityRequestRepository.find({
      select: ['id', 'title', 'description', 'requestedById', 'status', 'approvedById', 'approvedAt', 'createdAt', 'updatedAt', 'deletedAt'],
      order: { createdAt: 'DESC' },
    });
    return facilityRequests.map(entity => this.toFacilityRequestResponseDto(entity));
  } catch (error) {
    throw new HttpException({
      code: '0801',
      message: errorMessage['0801'],
      statusCode: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND);
  }
  }

  async update(id: string, updateDto: UpdateFacilityRequestDto): Promise<FacilityRequestResponseDto> {
    try {
    const facilityRequest = await this.facilityRequestRepository.findOne({
      select: ['id'],
      where: { id }
    });

    if (!facilityRequest) {
      throw new HttpException({
        code: '0701',
        message: 'Facility request not found',
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    Object.assign(facilityRequest, {
      ...updateDto,
      updatedAt: new Date(),
    });

    const updatedRequest = await this.facilityRequestRepository.save(facilityRequest);

    return this.toFacilityRequestResponseDto(updatedRequest);
  } catch (error) {
    throw new HttpException({
      code: '0701',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}


  async softDelete(id: string): Promise<FacilityRequestResponseDto> {
    try {
      const facilityRequest = await this.facilityRequestRepository.findOne({
      select: ['id'],
      where: { id }
    });
    facilityRequest.deletedAt = new Date();
    const deletedRequest = await this.facilityRequestRepository.save(facilityRequest);
    return this.toFacilityRequestResponseDto(deletedRequest);
  } catch (error) {
    throw new HttpException({
      code: '0701',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}

  async updateStatus(
    id: string,
    status: EFacilityStatus,
    actionById: string
  ): Promise<FacilityRequestResponseDto> {
    try {
    const facilityRequest = await this.findOne(id);

    facilityRequest.status = status;

    if (status === EFacilityStatus.APPROVED) {
      facilityRequest.approvedById = actionById;
      facilityRequest.approvedAt = new Date();
    } else {
      facilityRequest.approvedById = null;
      facilityRequest.approvedAt = null;
    }

    const updatedRequest = await this.facilityRequestRepository.save(facilityRequest);

    return this.toFacilityRequestResponseDto(updatedRequest);
  } catch (error) {
    throw new HttpException({
      code: '0701',
      message: 'Facility request not found',
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}

}

