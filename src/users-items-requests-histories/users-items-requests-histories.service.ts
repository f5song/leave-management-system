import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemsRequestsHistoryEntity } from '../database/entity/users-items-requests-histories.entity';
import { CreateItemsRequestsHistoryDto, ItemsRequestsHistoryResponseDto, UpdateItemsRequestsHistoryDto } from './items-requests-history.dto';


@Injectable()
export class UsersItemsRequestsHistoriesService {
  constructor(
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private usersItemsRequestsHistoriesRepository: Repository<UsersItemsRequestsHistoryEntity>,
  ) {}

  async findAll() {
    return this.usersItemsRequestsHistoriesRepository.find();
  }

    // toUserItemRequestHistoryResponseDto(
    //   entity: UsersItemsRequestsHistoryEntity
    // ): ItemsRequestsHistoryResponseDto {
    //   return {
    //     id: entity.id,
    //     userId: entity.userId,
    //     requestId: entity.requestId,
    //     status: entity.status,
    //     reason: entity.reason,
    //     createdAt: entity.createdAt,
    //     updatedAt: entity.updatedAt,
    //   };
    // }

  async findOne(id: string) {
    return this.usersItemsRequestsHistoriesRepository.findOne({
      where: { id },
      relations: ['user', 'request']
    });
  }

  async create(createDto: CreateItemsRequestsHistoryDto) {
    const history = this.usersItemsRequestsHistoriesRepository.create({
      ...createDto,
      createdAt: new Date(),
      updatedAt: new Date()
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
      updatedAt: new Date()
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
