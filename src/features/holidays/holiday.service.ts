import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { HolidayEntity } from '../../database/entity/holidays.entity';
import { CreateHolidayDto } from './dto/create.holidays.dto';
import { UpdateHolidayDto } from './dto/update.holidays.dto';
import { HolidayResponseDto } from './response/holidays.respones.dto';
import { errorMessage } from '@src/common/constants/error-message';
import * as moment from 'moment-timezone';

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

    const startDate = moment.tz(data.startDate, 'Asia/Bangkok').startOf('day');
    const endDate = data.endDate ? moment.tz(data.endDate, 'Asia/Bangkok').startOf('day') : null;

    if (!startDate.isValid()) {
      throw new HttpException({
        message: errorMessage['0212'],
        code: '0212',
      }, HttpStatus.BAD_REQUEST);
    }

    if (endDate && !endDate.isValid()) {
      throw new HttpException({
        message: errorMessage['0213'],
        code: '0213',
      }, HttpStatus.BAD_REQUEST);
    }

    if (endDate && startDate.isAfter(endDate)) {
      throw new HttpException({
        message: errorMessage['0214'],
        code: '0214',
      }, HttpStatus.BAD_REQUEST);
    }

    if (endDate) {
      const daysDiff = endDate.diff(startDate, 'days') + 1;

      if (data.totalDays !== undefined && data.totalDays !== daysDiff) {
        throw new HttpException({
          message: errorMessage['0215'],
          code: '0215',
        }, HttpStatus.BAD_REQUEST);
      }
    }
  }


  async validateNoOverlap(data: CreateHolidayDto | UpdateHolidayDto | any, holidayId?: string): Promise<void> {
    const startDateMoment = moment.tz(data.startDate, 'Asia/Bangkok').startOf('day');
    const endDateMoment = data.endDate ? moment.tz(data.endDate, 'Asia/Bangkok').startOf('day') : startDateMoment;
  
    const startDate = startDateMoment.toDate(); // แปลงเป็น Date
    const endDate = endDateMoment.toDate();     // แปลงเป็น Date
  
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
        message: errorMessage['0211'],
        code: '0211',
      }, HttpStatus.BAD_REQUEST);
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

  async create(id: string, createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    await this.validateDateRange(createHolidayDto);
    await this.validateNoOverlap(createHolidayDto);
  
    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      startDate: moment.tz(createHolidayDto.startDate, 'Asia/Bangkok').startOf('day').toDate(),
      endDate: createHolidayDto.endDate ? moment.tz(createHolidayDto.endDate, 'Asia/Bangkok').startOf('day').toDate() : null,
      createdById: id,
    });
  
    await this.holidayRepository.save(holiday);
    return this.toHolidayResponseDto(holiday);
  }
  

  async update(id: string, updateHolidayDto: UpdateHolidayDto): Promise<HolidayResponseDto> {
    const holidayEntity = await this.holidayRepository.findOne({ where: { id, deletedAt: null } });
    if (!holidayEntity) throw new HttpException({
      message: errorMessage['0201'],
      code: '0201',
    }, HttpStatus.BAD_REQUEST);
  
    const updatedData = {
      ...holidayEntity,
      ...updateHolidayDto,
      startDate: updateHolidayDto.startDate
        ? moment.tz(updateHolidayDto.startDate, 'Asia/Bangkok').startOf('day').toDate()
        : holidayEntity.startDate,
      endDate: updateHolidayDto.endDate
        ? moment.tz(updateHolidayDto.endDate, 'Asia/Bangkok').startOf('day').toDate()
        : holidayEntity.endDate,
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
