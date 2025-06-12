import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { CreateItemsRequestsHistoryDto } from './dto/create.users-items-requests-histories.dto';
import { UpdateItemsRequestsHistoryDto } from './dto/update.users-items-requests-histories.dto';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { ItemsRequestsHistoryResponseDto } from './respones/users-items-requests-histories.respones.dto';
import { errorMessage } from '@src/common/constants/error-message';



@Injectable()
export class UsersItemsRequestsHistoriesService {
  constructor(
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private usersItemsRequestsHistoriesRepository: Repository<UsersItemsRequestsHistoryEntity>,
  ) {}

  toUserItemRequestHistoryResponseDto(
    entity: UsersItemsRequestsHistoryEntity
  ): ItemsRequestsHistoryResponseDto {
    return {
      id: entity.id,
      requestId: entity.requestId,
      actionBy: entity.actionBy,
      actionType: entity.actionType,
      actionAt: entity.actionAt,
      borrow_start_date: entity.borrow_start_date,
      borrow_end_date: entity.borrow_end_date,
    };
  }

  async findAll() {
    return this.usersItemsRequestsHistoriesRepository.find({
      select: ['id', 'requestId', 'actionBy', 'actionType', 'actionAt', 'borrow_start_date', 'borrow_end_date'],
    });
  }

  async findOne(id: string) {
    return this.usersItemsRequestsHistoriesRepository.findOne({
      select: ['id', 'requestId', 'actionBy', 'actionType', 'actionAt', 'borrow_start_date', 'borrow_end_date'],
      where: { id },
      relations: ['user', 'request']
    });
  }

  async create(createDto: CreateItemsRequestsHistoryDto) {
    const history = this.usersItemsRequestsHistoriesRepository.create({
      ...createDto,
      actionAt: new Date(),
    });
    return this.usersItemsRequestsHistoriesRepository.save(history);
  }

  async update(id: string, updateDto: UpdateItemsRequestsHistoryDto) {
    const history = await this.findOne(id);
    if (!history) {
      throw new HttpException({
        code: '1101',
        message: errorMessage['1101'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }

    const updatedHistory = {
      ...history,
      ...updateDto,
      actionAt: new Date()
    };
    return this.usersItemsRequestsHistoriesRepository.save(updatedHistory);
  }

  async delete(id: string) {
    const history = await this.findOne(id);
    if (!history) {
      throw new HttpException({
        code: '1101',
        message: errorMessage['1101'],
        statusCode: HttpStatus.NOT_FOUND,
      }, HttpStatus.NOT_FOUND);
    }
    return this.usersItemsRequestsHistoriesRepository.remove(history);
  }
}
