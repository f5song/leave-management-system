import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemEntity } from '../../database/entity/users-items.entity';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { ItemRequestResponseDto } from '../users-items-requests/respones/users-items-requests.respones.dto';
import { UserEntity } from '../../database/entity/users.entity';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { CreateItemDto } from './dto/create.users-items.dto';
import { UserItemResponseDto } from './respones/users-items.respones.dto';
import { UpdateItemDto } from './dto/update.users-items.dto';


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
        description: entity.description,
        quantity: entity.quantity,
        status: entity.status,
        createdBy: entity.createdBy,
        createdById: entity.createdById,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      };
    }

    toUserItemRequestResponseDto(
      entity: UsersItemRequestEntity
    ): ItemRequestResponseDto {
      return {
        id: entity.id,
        itemId: entity.item.id,
        quantity: entity.quantity,
        status: entity.status,
        requestedById: entity.requestedBy.id,
        createdAt: entity.createdAt,
        deletedAt: entity.deletedAt,
      };
    }

  // Get all item requests
  async findAllRequests(): Promise<UsersItemRequestEntity[]> {
    return this.itemRequestRepository.find({
      select: ['id', 'itemId', 'quantity', 'status', 'requestedById', 'createdAt', 'deletedAt'],
      where: { deletedAt: null },
      relations: ['item', 'requestedById', 'approvedById'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์
  async findAll(): Promise<UsersItemEntity[]> {
    return this.itemRepository.find({
      select: ['id', 'name', 'description', 'quantity', 'status', 'createdBy', 'createdById', 'createdAt', 'updatedAt', 'deletedAt'],
      where: { deletedAt: null },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
  }

  // ฟังก์ชันสำหรับรับรายการอุปกรณ์ตาม ID
  async findOne(id: string): Promise<UsersItemEntity> {
    const item = await this.itemRepository.findOne({
      where: { id },
      select: ['id', 'name', 'description', 'quantity', 'status', 'createdBy', 'createdById', 'createdAt', 'updatedAt', 'deletedAt'],
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy'],
    });
    if (!item) {
      throw new Error('Item not found');
    }
    return item;
  }

  // ฟังก์ชันสำหรับสร้างรายการอุปกรณ์
  async create(createdById: string, item: CreateItemDto): Promise<UsersItemEntity> {
    const newItem = this.itemRepository.create(item);
    newItem.createdById = createdById;
    return await this.itemRepository.save(newItem);
  }

  // ฟังก์ชันสำหรับอัพเดทรายการอุปกรณ์
  async update(id: string, item: UpdateItemDto): Promise<UsersItemEntity> {
    await this.itemRepository.update(id, item);
    return await this.findOne(id);
  }

  // ฟังก์ชันสำหรับลบรายการอุปกรณ์
  async remove(id: string): Promise<void> {
    await this.itemRepository.softDelete(id);
  }

  // // ฟังก์ชันสำหรับสร้างคำร้องขออุปกรณ์
  // async createRequest(request: Partial<UsersItemRequestEntity>): Promise<ItemRequestResponseDto> {
  //   const newRequest = this.itemRequestRepository.create(request);
  //   return await this.itemRequestRepository.save(newRequest);
  // }

  // ฟังก์ชันสำหรับอัพเดทสถานะคำร้องขอ
//   async updateRequestStatus(
//     requestId: string,
//     status: EItemRequestStatus,
//     approvedBy?: string,
//   ): Promise<ItemRequestResponseDto> {
//     const request = await this.itemRequestRepository.findOne({
//       where: { id: requestId },
//       select: ['id', 'itemId', 'quantity', 'status', 'requestedById', 'createdAt', 'deletedAt'],
//       relations: ['item', 'requestedById', 'approvedById'],
//     });

//     if (!request) {
//       throw new Error('Request not found');
//     }

//     request.status = status;
//     request.approvedBy.id = approvedBy;

//     return await this.itemRequestRepository.save(request);
//   }
}
