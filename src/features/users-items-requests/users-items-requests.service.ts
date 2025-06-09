import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { ItemRequestResponseDto } from './dto/users-items-requests.respones.dto';
import { CreateItemRequestDto } from './dto/create.users-items-requests.dto';
import { UpdateItemRequestDto } from './dto/update.users-items-requests.dto';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';

@Injectable()
export class UsersItemsRequestsService {
  constructor(
    @InjectRepository(UsersItemRequestEntity)
    private readonly itemRequestRepository: Repository<UsersItemRequestEntity>,
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private readonly historyRepository: Repository<UsersItemsRequestsHistoryEntity>,
  ) { }

  toUserItemRequestResponseDto(
    entity: UsersItemRequestEntity
  ): ItemRequestResponseDto {
    return {
      id: entity.id,
      itemId: entity.item.id,
      quantity: entity.quantity,
      status: entity.status,
      requestedBy: entity.requestedBy?.id,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    };
  }


  async create(createDto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    const itemRequest = this.itemRequestRepository.create({
      itemId: createDto.itemId,
      quantity: createDto.quantity,
      status: EItemRequestStatus.PENDING,
      requestedBy: createDto.requestedBy,
    });

    const savedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(savedRequest);
  }


  // ดึง Entity จริงสำหรับแก้ไข (return Entity)
  async findOneEntity(id: string): Promise<UsersItemRequestEntity> {
    const entity = await this.itemRequestRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['item', 'requestedBy', 'approvedBy', 'history', 'history.actionBy'],
    });
    if (!entity) throw new Error('Item request not found');
    return entity;
  }

  // ดึง DTO สำหรับส่ง response (return DTO)
  async findOneDto(id: string): Promise<ItemRequestResponseDto> {
    const entity = await this.findOneEntity(id);
    return this.toUserItemRequestResponseDto(entity);
  }


  async approve(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
    const itemRequest = await this.findOneEntity(id);
    itemRequest.status = EItemRequestStatus.APPROVED;

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy: approvedBy,
      actionType: EItemRequestStatus.APPROVED,
    });
    await this.historyRepository.save(history);

    const updatedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(updatedRequest);
  }


  async reject(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
    const itemRequest = await this.findOneEntity(id);
    itemRequest.status = EItemRequestStatus.REJECTED;

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy: approvedBy,
      actionType: EItemRequestStatus.REJECTED,
    });
    await this.historyRepository.save(history);

    const updatedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(updatedRequest);
  }


  async findAllByUser(userId: string): Promise<ItemRequestResponseDto[]> {
    const itemRequests = await this.itemRequestRepository.find({
      where: { requestedBy: { id: userId }, deletedAt: null },
      relations: ['item', 'requestedBy', 'approvedBy'],
      order: { createdAt: 'DESC' },
    });
    return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
  }

  async softDelete(id: string): Promise<ItemRequestResponseDto> {
    const itemRequest = await this.findOneEntity(id);
    const oldStatus = itemRequest.status;
    itemRequest.deletedAt = new Date();

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy:   itemRequest.requestedBy.id,
      actionType: EItemRequestStatus.REJECTED,
    });

    await this.historyRepository.save(history);

    const deletedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(deletedRequest);
  }


  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    const itemRequests = await this.itemRequestRepository.find({
      where: { status: EItemRequestStatus.PENDING, deletedAt: null },
      relations: ['item', 'requestedBy', 'actionBy'],
      order: { createdAt: 'DESC' },
    });
    return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
  }
}
