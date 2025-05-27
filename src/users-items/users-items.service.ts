import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from '../database/entity/users-items.entity';
import { ItemRequestEntity } from '../database/entity/users-items-request.entity';
import { UserEntity } from '../database/entity/users.entity';
import { ItemRequestStatus } from '../constants/item-request-status.enum';

@Injectable()
export class UsersItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(ItemRequestEntity)
    private itemRequestRepository: Repository<ItemRequestEntity>,
  ) {}

  // Get all item requests
  async findAllRequests(): Promise<ItemRequestEntity[]> {
    return this.itemRequestRepository.find({
      relations: ['item', 'requestedBy', 'approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์
  async findAll(): Promise<ItemEntity[]> {
    return this.itemRepository.find({
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์ตาม ID
  async findOne(id: string): Promise<ItemEntity> {
    return this.itemRepository.findOne({
      where: { id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับสร้างรายการอุปกรณ์
  async create(item: Partial<ItemEntity>): Promise<ItemEntity> {
    const newItem = this.itemRepository.create(item);
    return this.itemRepository.save(newItem);
  }

  // ฟังก์ชันสำหรับอัพเดทรายการอุปกรณ์
  async update(id: string, item: Partial<ItemEntity>): Promise<ItemEntity> {
    await this.itemRepository.update(id, item);
    return this.findOne(id);
  }

  // ฟังก์ชันสำหรับลบรายการอุปกรณ์
  async remove(id: string): Promise<void> {
    await this.itemRepository.softDelete(id);
  }

  // ฟังก์ชันสำหรับสร้างคำร้องขออุปกรณ์
  async createRequest(request: Partial<ItemRequestEntity>): Promise<ItemRequestEntity> {
    const newRequest = this.itemRequestRepository.create(request);
    return this.itemRequestRepository.save(newRequest);
  }

  // ฟังก์ชันสำหรับอัพเดทสถานะคำร้องขอ
  async updateRequestStatus(
    requestId: string,
    status: ItemRequestStatus,
    approvedBy?: UserEntity,
  ): Promise<ItemRequestEntity> {
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
