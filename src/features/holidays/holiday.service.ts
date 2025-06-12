import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { HolidayEntity } from '../../database/entity/holidays.entity';
import { CreateHolidayDto } from './dto/create.holidays.dto';
import { UpdateHolidayDto } from './dto/update.holidays.dto';
import { HolidayResponseDto } from './response/holidays.respones.dto';
import { errorMessage } from '@src/common/constants/error-message';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(HolidayEntity)
    private readonly holidayRepository: Repository<HolidayEntity>,
  ) { }

  toHolidayResponseDto(holiday: HolidayEntity): HolidayResponseDto {
    return {
      id: holiday.id,
      title: holiday.title,
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      description: holiday.description,
      totalDays: holiday.totalDays,
      color: holiday.color,
      createdAt: holiday.createdAt,
      updatedAt: holiday.updatedAt,
      deletedAt: holiday.deletedAt,
    };
  }

  async validateDateRange(data: CreateHolidayDto | UpdateHolidayDto | any): Promise<void> {
    if (!data.startDate) {
      throw new BadRequestException('startDate is required');
    }
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (isNaN(startDate.getTime())) 
      throw new HttpException({
        message: errorMessage['0207'],
        code: '0207',
      },
        HttpStatus.BAD_REQUEST);
    if (endDate && isNaN(endDate.getTime())) 
      throw new HttpException({
        message: errorMessage['0208'],
        code: '0208',
      },
        HttpStatus.BAD_REQUEST);
    if (endDate && startDate > endDate) 
      throw new HttpException({
        message: errorMessage['0207'],
        code: '0207',
      },
        HttpStatus.BAD_REQUEST);

    if (endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (data.totalDays !== undefined && data.totalDays !== daysDiff) {
        throw new HttpException({
          message: errorMessage['0209'],
          code: '0209',
        },
          HttpStatus.BAD_REQUEST);
      }
    }
  }

  async validateNoOverlap(data: CreateHolidayDto | UpdateHolidayDto | any, holidayId?: string): Promise<void> {
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : startDate;

    const whereClause: any = {
      deletedAt: null,
      startDate: LessThanOrEqual(endDate),
      endDate: MoreThanOrEqual(startDate),
    };

    if (holidayId) {
      whereClause.id = Not(holidayId);
    }

    const overlapping = await this.holidayRepository.find({ where: whereClause });
    if (overlapping.length > 0) {
      throw new HttpException({
        message: errorMessage['0206'],
        code: '0206',
      },
        HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      select: ['id', 'title', 'startDate', 'endDate', 'description', 'totalDays', 'color'],
      where: { deletedAt: null },
      order: { startDate: 'ASC' },
      take: 15,
    });
    return holidays.map(holiday => this.toHolidayResponseDto(holiday));
  }

  async findOne(id: string): Promise<HolidayResponseDto> {
    const holiday = await this.holidayRepository.findOne({
      select: ['id', 'title', 'startDate', 'endDate', 'description', 'totalDays', 'color'],
      where: { id, deletedAt: null },
    });
    if (!holiday) throw new HttpException({
      message: errorMessage['0201'],
      code: '0201',
    },
      HttpStatus.BAD_REQUEST);
    return this.toHolidayResponseDto(holiday);
  }

  async create(createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    await this.validateDateRange(createHolidayDto);
    await this.validateNoOverlap(createHolidayDto);

    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      startDate: new Date(createHolidayDto.startDate),
      endDate: createHolidayDto.endDate ? new Date(createHolidayDto.endDate) : null,
    });
    await this.holidayRepository.save(holiday);
    return this.toHolidayResponseDto(holiday);
  }

  async update(id: string, updateHolidayDto: UpdateHolidayDto): Promise<HolidayResponseDto> {
    const holidayEntity = await this.holidayRepository.findOne({ where: { id, deletedAt: null } });
    if (!holidayEntity) throw new HttpException({
      message: errorMessage['0201'],
      code: '0201',
    },
      HttpStatus.BAD_REQUEST);

    const updatedData = {
      ...holidayEntity,
      ...updateHolidayDto,
      startDate: updateHolidayDto.startDate ? new Date(updateHolidayDto.startDate) : holidayEntity.startDate,
      endDate: updateHolidayDto.endDate ? new Date(updateHolidayDto.endDate) : holidayEntity.endDate,
    };

    await this.validateDateRange(updatedData);
    await this.validateNoOverlap(updatedData, id);

    const updatedHoliday = await this.holidayRepository.save(updatedData);
    return this.toHolidayResponseDto(updatedHoliday);
  }

  async softDelete(id: string): Promise<void> {
    const holiday = await this.holidayRepository.findOne({ where: { id, deletedAt: null } });
    if (!holiday) throw new HttpException({
      message: errorMessage['0201'],
      code: '0201',
    },
      HttpStatus.BAD_REQUEST);

    await this.holidayRepository.softRemove(holiday);
  }

}
