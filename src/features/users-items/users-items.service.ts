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
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { ItemsRequestsHistoryResponseDto } from '../users-items-requests-histories/respones/users-items-requests-histories.respones.dto';
import { EItemStatus } from '@src/common/constants/item-status.enum';
@Injectable()
export class UsersItemsService {
  constructor(
    @InjectRepository(UsersItemEntity)
    private itemRepository: Repository<UsersItemEntity>,
    @InjectRepository(UsersItemRequestEntity)
    private itemRequestRepository: Repository<UsersItemRequestEntity>,
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private historyRepository: Repository<UsersItemsRequestsHistoryEntity>,
  ) { }

  // แปลง UsersItemsRequestsHistoryEntity เป็น DTO
  toHistoryResponseDto(entity: UsersItemsRequestsHistoryEntity): ItemsRequestsHistoryResponseDto {
    return {
      id: entity.id,
      actionAt: entity.actionAt,
      actionType: entity.actionType,
      actionById: entity.actionedBy?.id ?? entity.actionById ?? null,
      // request: entity.request ? { id: entity.request.id } : undefined,
      // เพิ่มเติมถ้ามี property อื่น ๆ ใน DTO
    };
  }

  // แปลง UsersItemRequestEntity เป็น DTO พร้อมแปลง history ด้วย
  toUserItemRequestResponseDto(entity: UsersItemRequestEntity): ItemRequestResponseDto {
    return {
      id: entity.id,
      itemId: entity.item?.id ?? entity.itemId,
      quantity: entity.quantity,
      status: entity.status,
      requestedById: entity.requestedBy ? entity.requestedBy.id : null,
      approvedById: entity.approvedBy ? entity.approvedBy.id : null,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      history: entity.history ? entity.history.map(h => this.toHistoryResponseDto(h)) : [],
    };
    
  }

  // แปลง UsersItemEntity เป็น DTO พร้อมแปลง itemRequests เป็น DTO array
  toUserItemResponseDto(entity: UsersItemEntity): UserItemResponseDto {
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
      itemRequests: entity.itemRequests ? entity.itemRequests.map(ir => this.toUserItemRequestResponseDto(ir)) : [],
    };
  }

  // ดึงข้อมูลคำร้องขอทั้งหมด และแปลงเป็น DTO
  // async findAllRequests(): Promise<ItemRequestResponseDto[]> {
  //   const itemRequests = await this.itemRequestRepository.find({
  //     where: { deletedAt: null },
  //     relations: ['item', 'requestedBy', 'approvedBy', 'history'],
  //     order: { createdAt: 'DESC' },
  //   });
  //   return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
  // }

  // ดึงข้อมูลอุปกรณ์ทั้งหมด พร้อมแปลงเป็น DTO
  async findAll(): Promise<UserItemResponseDto[]> {
    const items = await this.itemRepository.find({
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
      order: { createdAt: 'DESC' },
    });

    items.forEach((entity, index) => {
      console.log(`Item index: ${index}, id: ${entity.id}`);
      // ถ้าจะดูละเอียดกว่านี้ เช่น itemRequests
      if (entity.itemRequests) {
        entity.itemRequests.forEach((req, reqIndex) => {
          console.log(`  ItemRequest index: ${reqIndex}, id: ${req.id}`);
          console.log(`    requestedBy id: ${req.requestedBy?.id}`);
          console.log(`    approvedBy id: ${req.approvedBy?.id}`);
        });
      }
    });
    return items.map(entity => this.toUserItemResponseDto(entity));
  }

  // ดึงข้อมูลอุปกรณ์ตาม ID พร้อมแปลงเป็น DTO
  async findOne(id: string): Promise<UserItemResponseDto> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
    });
    if (!item) {
      throw new Error('Item not found');
    }
    return this.toUserItemResponseDto(item);
  }

  // สร้างรายการอุปกรณ์ใหม่
  async create(createdById: string, item: CreateItemDto): Promise<UserItemResponseDto> {
    const newItem = this.itemRepository.create({
      ...item,
      status: EItemStatus.AVAILABLE,
    });
    newItem.createdById = createdById;

    const savedItem = await this.itemRepository.save(newItem);

    const fullItem = await this.itemRepository.findOne({
      where: { id: savedItem.id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
    });

    return this.toUserItemResponseDto(fullItem!);
  }


  // อัพเดทรายการอุปกรณ์ตาม ID และคืนค่า DTO
  async update(id: string, item: UpdateItemDto): Promise<UserItemResponseDto> {
    await this.itemRepository.update(id, item);
    return this.findOne(id);
  }

  // ลบรายการอุปกรณ์แบบ soft delete
  async remove(id: string): Promise<void> {
    await this.itemRepository.softDelete(id);
  }
}

