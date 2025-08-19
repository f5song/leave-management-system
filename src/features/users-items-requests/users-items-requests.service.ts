import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemRequestEntity } from '../../database/entity/users-items-requests.entity';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { ItemRequestResponseDto } from './respones/users-items-requests.respones.dto';
import { CreateItemRequestDto } from './dto/create.users-items-requests.dto';
import { UpdateItemRequestDto } from './dto/update.users-items-requests.dto';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { UserEntity } from '../../database/entity/users.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class UsersItemsRequestsService {
  constructor(
    @InjectRepository(UsersItemRequestEntity)
    private readonly itemRequestRepository: Repository<UsersItemRequestEntity>,
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private readonly historyRepository: Repository<UsersItemsRequestsHistoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  toUserItemRequestResponseDto(
    entity: UsersItemRequestEntity
  ): ItemRequestResponseDto {
    return {
      id: entity.id,
      itemId: entity.item?.id ?? entity.itemId, // fallback ด้วย itemId ถ้า item null
      quantity: entity.quantity,
      status: entity.status,
      requestedById: entity.requestedBy?.id ?? entity.requestedById ?? null, // fallback
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      borrow_start_date: entity.borrow_start_date,
      borrow_end_date: entity.borrow_end_date,
    };
  }



  async create(createDto: CreateItemRequestDto, id: string): Promise<ItemRequestResponseDto> {
    try {
    const itemRequest = this.itemRequestRepository.create({
      itemId: createDto.itemId,
      quantity: createDto.quantity,
      status: EItemRequestStatus.PENDING,
      borrow_start_date: createDto.borrow_start_date,
      borrow_end_date: createDto.borrow_end_date,
      requestedById: id,
      history: [],
    });

    const savedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(savedRequest);
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async findOneEntity(id: string): Promise<UsersItemRequestEntity> {
    try {
    const entity = await this.itemRequestRepository.findOne({
      where: { id },
      relations: ['item', 'requestedBy', 'approvedBy', 'history', 'history.actionedBy'],
    });
    if (!entity) throw new Error('Item request not found');
    return entity;
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  // ดึง DTO สำหรับส่ง response (return DTO)
  async findOneDto(id: string): Promise<ItemRequestResponseDto> {
    const entity = await this.findOneEntity(id);
    return this.toUserItemRequestResponseDto(entity);
  }

  async updateStatus(
    id: string,
    updateDto: UpdateItemRequestDto
  ): Promise<ItemRequestResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
      const itemRequest = await manager.findOne(UsersItemRequestEntity, {
        where: { id },
        relations: ['item', 'requestedBy', 'approvedBy', 'history'],
      });

      if (!itemRequest) throw new HttpException(
        {
          code: '1001',
          message: errorMessage['1001'],
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND
      );

      itemRequest.status = updateDto.status;
      itemRequest.updatedAt = new Date();

      if (updateDto.status === EItemRequestStatus.APPROVED) {
        itemRequest.approvedById = updateDto.approveById;
      } else {
        itemRequest.approvedBy = null;
      }

      await manager.save(itemRequest);

      const history = manager.create(UsersItemsRequestsHistoryEntity, {
        requestId: itemRequest.id,
        actionById: updateDto.approveById,
        actionType: updateDto.status,
      });
      await manager.save(history);


      const updated = await manager.findOne(UsersItemRequestEntity, {
        where: { id: itemRequest.id },
        relations: ['item', 'requestedBy', 'approvedBy', 'history'],
      });

      return this.toUserItemRequestResponseDto(updated!);
      } catch (error) {
        throw new HttpException({
          code: '1001',
          message: errorMessage['1001'],
          statusCode: HttpStatus.BAD_REQUEST,
        }, HttpStatus.BAD_REQUEST);
      }
    });
  }



  async findAllByUser(userId: string): Promise<ItemRequestResponseDto[]> {
    try {
      const itemRequests = await this.itemRequestRepository.find({
        where: { requestedById: userId, deletedAt: null },
        relations: ['item', 'requestedBy', 'approvedBy', 'history', 'history.actionedBy'],
        order: { createdAt: 'DESC' },
      });
      
      return itemRequests.map(entity => ({
        ...this.toUserItemRequestResponseDto(entity),
        itemName: entity.item?.name
      }));
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async softDelete(id: string, userId: string): Promise<ItemRequestResponseDto> {
    try {
    const itemRequest = await this.findOneEntity(id);
    itemRequest.deletedAt = new Date();

    // Create history record
    const history = this.historyRepository.create({
      request: itemRequest,
      actionById: userId,
      actionType: EItemRequestStatus.REJECTED,
    });

    await this.historyRepository.save(history);

    const deletedRequest = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(deletedRequest);
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async findAllPending(): Promise<ItemRequestResponseDto[]> {
    try {
    const itemRequests = await this.itemRequestRepository.find({
      select: ['id', 'itemId', 'quantity', 'status', 'requestedById', 'createdAt', 'deletedAt'],
      where: { status: EItemRequestStatus.PENDING, deletedAt: null },
      relations: ['item', 'requestedBy', 'approvedBy', 'history', 'history.actionedBy'],
      order: { createdAt: 'DESC' },
    });
    return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<ItemRequestResponseDto[]> {
    try {
    const itemRequests = await this.itemRequestRepository.find({
      select: ['id', 'itemId', 'quantity', 'status', 'requestedById', 'createdAt', 'deletedAt', 'borrow_start_date', 'borrow_end_date'],
      relations: ['item', 'requestedBy', 'approvedBy', 'history', 'history.actionedBy'],
      order: { createdAt: 'DESC' },
    });
    return itemRequests.map(entity => this.toUserItemRequestResponseDto(entity));
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateDto: UpdateItemRequestDto): Promise<ItemRequestResponseDto> {
    try {
    const itemRequest = await this.findOneEntity(id);

    if (updateDto.status !== undefined) {
      itemRequest.status = updateDto.status;
    }

    if (updateDto.approveById !== undefined) {
      itemRequest.approvedById = updateDto.approveById;
    }

    if (updateDto.quantity !== undefined) {
      itemRequest.quantity = updateDto.quantity;
    }

    if (updateDto.borrow_start_date !== undefined) {
      itemRequest.borrow_start_date = new Date(updateDto.borrow_start_date);
    }

    if (updateDto.borrow_end_date !== undefined) {
      itemRequest.borrow_end_date = new Date(updateDto.borrow_end_date);
    }

    itemRequest.updatedAt = new Date();

    const saved = await this.itemRequestRepository.save(itemRequest);
    return this.toUserItemRequestResponseDto(saved);
    } catch (error) {
      throw new HttpException({
        code: '1001',
        message: errorMessage['1001'],
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }
  }

}

  // async approve(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
  //   const itemRequest = await this.findOneEntity(id);

  //   itemRequest.status = EItemRequestStatus.APPROVED;

  //   const history = this.historyRepository.create({
  //     request: itemRequest, // ใส่ object เลย
  //     actionById: approvedBy,
  //     actionType: EItemRequestStatus.APPROVED,
  //   });


  //   await this.historyRepository.save(history);

  //   await this.itemRequestRepository.save(itemRequest);

  //   // ✅ ดึง entity ใหม่หลัง save เพื่อให้ได้ relation `item` กลับมาครบ
  //   const updatedRequest = await this.findOneEntity(id);
  //   return this.toUserItemRequestResponseDto(updatedRequest);
  // }



  // async reject(id: string, approvedBy: string): Promise<ItemRequestResponseDto> {
  //   const itemRequest = await this.findOneEntity(id);
  //   itemRequest.status = EItemRequestStatus.REJECTED;

  //   // Create history record
  //   const history = this.historyRepository.create({
  //     request: itemRequest,
  //     actionById: approvedBy,
  //     actionType: EItemRequestStatus.REJECTED,
  //   });
  //   await this.historyRepository.save(history);

  //   const updatedRequest = await this.itemRequestRepository.save(itemRequest);
  //   return this.toUserItemRequestResponseDto(updatedRequest);
  // }
