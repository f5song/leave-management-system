import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemEntity } from '../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../database/entity/users-items-requests.entity';
import { UserEntity } from '../database/entity/users.entity';
import { ItemRequestStatus } from '../constants/item-request-status.enum';
import { UserItemResponseDto } from './users-items.dto';

@Injectable()
export class UsersItemsService {
  constructor(
    @InjectRepository(UsersItemEntity)
    private itemRepository: Repository<UsersItemEntity>,
    @InjectRepository(UsersItemRequestEntity)
    private itemRequestRepository: Repository<UsersItemRequestEntity>,
  ) { }

  toUserItemResponseDto(
    entity: UsersItemEntity
  ): UserItemResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      categoryId: entity.categoryId,
      description: entity.description,
      quantity: entity.quantity,
      unit: entity.unit,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    };
  }

  // Get all item requests
  async findAllRequests(): Promise<UsersItemRequestEntity[]> {
    return this.itemRequestRepository.find({
      relations: ['item', 'requestedBy', 'approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์
  async findAll(): Promise<UsersItemEntity[]> {
    return this.itemRepository.find({
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์ตาม ID
  async findOne(id: string): Promise<UsersItemEntity> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  // ฟังก์ชันสำหรับสร้างรายการอุปกรณ์
  async create(item: Partial<UsersItemEntity>): Promise<UsersItemEntity> {
    const newItem = this.itemRepository.create(item);
    return this.itemRepository.save(newItem);
  }

  // ฟังก์ชันสำหรับอัพเดทรายการอุปกรณ์
  async update(id: string, item: Partial<UsersItemEntity>): Promise<UsersItemEntity> {
    await this.itemRepository.update(id, item);
    return this.findOne(id);
  }

  // ฟังก์ชันสำหรับลบรายการอุปกรณ์
  async remove(id: string): Promise<void> {
    await this.itemRepository.softDelete(id);
  }

  // ฟังก์ชันสำหรับสร้างคำร้องขออุปกรณ์
  async createRequest(request: Partial<UsersItemRequestEntity>): Promise<UsersItemRequestEntity> {
    const newRequest = this.itemRequestRepository.create(request);
    return this.itemRequestRepository.save(newRequest);
  }

  // ฟังก์ชันสำหรับอัพเดทสถานะคำร้องขอ
  async updateRequestStatus(
    requestId: string,
    status: ItemRequestStatus,
    approvedBy?: UserEntity,
  ): Promise<UsersItemRequestEntity> {
    const request = await this.itemRequestRepository.findOne({
      where: { id: requestId },
      relations: ['item', 'requestedBy'],
    });

    if (!request) {
      throw new Error('Request not found');
    }

    request.status = status;
    request.approvedAt = new Date();
    request.approvedBy = approvedBy;

    return this.itemRequestRepository.save(request);
  }
}
