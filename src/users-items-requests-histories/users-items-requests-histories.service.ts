import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersItemsRequestsHistoryEntity } from '../database/entity/users-items-requests-histories.entity';
import { CreateItemsRequestsHistoryDto, UpdateItemsRequestsHistoryDto } from './items-requests-history.dto';


@Injectable()
export class UsersItemsRequestsHistoriesService {
  constructor(
    @InjectRepository(UsersItemsRequestsHistoryEntity)
    private usersItemsRequestsHistoriesRepository: Repository<UsersItemsRequestsHistoryEntity>,
  ) {}

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
