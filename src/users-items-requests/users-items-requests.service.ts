import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../database/entity/users-items-requests-histories.entity';
import { CreateItemRequestDto, ItemRequestResponseDto } from './item-request.dto';
import { ItemRequestStatus } from 'src/constants/item-request-status.enum';

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
      requestedBy: entity.requestedBy,
      approvedAt: entity.approvedAt,
      approvedBy: entity.approvedBy,
      createdAt: entity.createdAt,
    };
  }


  async create(createDto: CreateItemRequestDto): Promise<ItemRequestResponseDto> {
    const itemRequest = this.itemRequestRepository.create({
      itemId: createDto.itemId,
      quantity: createDto.quantity,
      status: ItemRequestStatus.PENDING,
      requestedBy: createDto.requestedBy,
    });

    const savedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(savedRequest);
  }


  async findOne(id: string): Promise<UsersItemRequestEntity> {
    const itemRequest = await this.itemRequestRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['item', 'requestedBy', 'approvedBy']
    });
    if (!itemRequest) {
      throw new Error('Item request not found');
    }
    return itemRequest;
  }

  async approve(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
    const itemRequest = await this.findOne(id);
    const oldStatus = itemRequest.status;
    itemRequest.status = ItemRequestStatus.APPROVED;
    itemRequest.approvedAt = new Date();

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy: { id: approvedBy },
      actionType: ItemRequestStatus.APPROVED,
      oldStatus : itemRequest.status,
    });
    await this.historyRepository.save(history);

    const updatedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(updatedRequest);
  }


  async reject(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
    const itemRequest = await this.findOne(id);
    const oldStatus = itemRequest.status;
    itemRequest.status = ItemRequestStatus.REJECTED;
    itemRequest.approvedAt = new Date();

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy: { id: approvedBy },
      actionType: ItemRequestStatus.REJECTED,
      oldStatus,
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
    const itemRequest = await this.findOne(id);
    const oldStatus = itemRequest.status;
    itemRequest.deletedAt = new Date();

    // Create history record
    const history = this.historyRepository.create({
      requestId: itemRequest.id,
      actionBy: { id: itemRequest.requestedBy.id },
      actionType: ItemRequestStatus.REJECTED,
      oldStatus,
    });
  
    await this.historyRepository.save(history);
  
    const deletedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(deletedRequest);
  }
  

  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    const itemRequests = await this.itemRequestRepository.find({
      where: { status: ItemRequestStatus.PENDING, deletedAt: null },
      relations: ['item', 'requestedBy', 'actionBy'],
      order: { createdAt: 'DESC' },
    });
    return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
  }
}
