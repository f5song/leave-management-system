import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { errorMessage } from '@src/common/constants/error-message';
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

  toHistoryResponseDto(entity: UsersItemsRequestsHistoryEntity): ItemsRequestsHistoryResponseDto {
    return {
      id: entity.id,
      actionAt: entity.actionAt,
      actionType: entity.actionType,
      actionById: entity.actionedBy?.id ?? entity.actionById ?? null,
    };
  }

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

  // async findAllRequests(): Promise<ItemRequestResponseDto[]> {
  //   const itemRequests = await this.itemRequestRepository.find({
  //     where: { deletedAt: null },
  //     relations: ['item', 'requestedBy', 'approvedBy', 'history'],
  //     order: { createdAt: 'DESC' },
  //   });
  //   return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
  // }

  async findAll(): Promise<UserItemResponseDto[]> {
    try {
    const items = await this.itemRepository.find({
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
      order: { createdAt: 'DESC' },
    });

    return items.map(entity => this.toUserItemResponseDto(entity));
  } catch (error) {
    throw new HttpException({
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}

  // ดึงข้อมูลอุปกรณ์ตาม ID พร้อมแปลงเป็น DTO
  async findOne(id: string): Promise<UserItemResponseDto> {
    try {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
    });
    return this.toUserItemResponseDto(item);
  } catch (error) {
    throw new HttpException({
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}

  // สร้างรายการอุปกรณ์ใหม่
  async create(createdById: string, item: CreateItemDto): Promise<UserItemResponseDto> {
    const newItem = this.itemRepository.create({
      ...item,
      status: EItemStatus.AVAILABLE,
    });
    newItem.createdById = createdById;

    const savedItem = await this.itemRepository.save(newItem);

    try {
    const fullItem = await this.itemRepository.findOne({
      where: { id: savedItem.id },
      relations: ['itemRequests', 'itemRequests.requestedBy', 'itemRequests.approvedBy', 'itemRequests.history', 'itemRequests.history.request'],
    });

    return this.toUserItemResponseDto(fullItem!);
  } catch (error) {
    throw new HttpException({
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}


  // อัพเดทรายการอุปกรณ์ตาม ID และคืนค่า DTO
  async update(id: string, item: UpdateItemDto): Promise<UserItemResponseDto> {
    try {
    await this.itemRepository.update(id, item);
    return this.findOne(id);
  } catch (error) {
    throw new HttpException({
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}

  // ลบรายการอุปกรณ์แบบ soft delete
  async remove(id: string): Promise<void> {
    try {
    await this.itemRepository.softDelete(id);
  } catch (error) {
    throw new HttpException({
      code: '0901',
      message: errorMessage['0901'],
      statusCode: HttpStatus.BAD_REQUEST,
    }, HttpStatus.BAD_REQUEST);
  }
}
}
