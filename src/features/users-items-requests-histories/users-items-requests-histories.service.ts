import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemsRequestsHistoryEntity } from '../../database/entity/users-items-requests-histories.entity';
import { CreateItemsRequestsHistoryDto } from './dto/create.users-items-requests-histories.dto';
import { UpdateItemsRequestsHistoryDto } from './dto/update.users-items-requests-histories.dto';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { ItemsRequestsHistoryResponseDto } from './respones/users-items-requests-histories.respones.dto';



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
    return this.usersItemsRequestsHistoriesRepository.find();
  }

  async findOne(id: string) {
    return this.usersItemsRequestsHistoriesRepository.findOne({
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
      throw new NotFoundException(`History with ID ${id} not found`);
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
      throw new NotFoundException(`History with ID ${id} not found`);
    }
    return this.usersItemsRequestsHistoriesRepository.remove(history);
  }
}
