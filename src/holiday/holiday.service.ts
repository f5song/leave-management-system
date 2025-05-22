import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { HolidayEntity } from '../database/entity/holiday.entity';
import { CreateHolidayDto, UpdateHolidayDto } from './holiday.validation';
import { HolidayResponseDto } from './holiday-response.dto';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(HolidayEntity)
    private readonly holidayRepository: Repository<HolidayEntity>,
  ) {}

  private toResponseDto(holiday: HolidayEntity): HolidayResponseDto {
    return {
      id: holiday.id,
      title: holiday.title,
      start_date: holiday.start_date,
      end_date: holiday.end_date,
      total_days: holiday.total_days,
      color: holiday.color,
      created_at: holiday.created_at,
      update_time: holiday.update_time,
      delete_time: holiday.delete_time,
    };
  }

  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      where: { delete_time: null },
      order: { start_date: 'ASC' },
    });
    return holidays.map(h => this.toResponseDto(h));
  }

  async findOne(id: number): Promise<HolidayResponseDto> {
    const holiday = await this.holidayRepository.findOne({
      where: { id, delete_time: null },
    });
    if (!holiday) throw new NotFoundException(`Holiday with id ${id} not found`);
    return this.toResponseDto(holiday);
  }

  async create(createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    await this.validateDateRange(createHolidayDto);
    await this.validateNoOverlap(createHolidayDto);

    const holiday = this.holidayRepository.create({
      ...createHolidayDto,
      start_date: new Date(createHolidayDto.start_date),
      end_date: createHolidayDto.end_date ? new Date(createHolidayDto.end_date) : null,
    });
    await this.holidayRepository.save(holiday);
    return this.toResponseDto(holiday);
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto): Promise<HolidayResponseDto> {
    const holidayEntity = await this.holidayRepository.findOne({ where: { id, delete_time: null } });
    if (!holidayEntity) throw new NotFoundException(`Holiday with id ${id} not found`);

    const updatedData = {
      ...holidayEntity,
      ...updateHolidayDto,
      start_date: updateHolidayDto.start_date ? new Date(updateHolidayDto.start_date) : holidayEntity.start_date,
      end_date: updateHolidayDto.end_date ? new Date(updateHolidayDto.end_date) : holidayEntity.end_date,
    };

    await this.validateDateRange(updatedData);
    await this.validateNoOverlap(updatedData, id);

    const updatedHoliday = await this.holidayRepository.save(updatedData);
    return this.toResponseDto(updatedHoliday);
  }

  async softDelete(id: number): Promise<void> {
    const holiday = await this.holidayRepository.findOne({ where: { id, delete_time: null } });
    if (!holiday) throw new NotFoundException(`Holiday with id ${id} not found`);

    await this.holidayRepository.update(id, { delete_time: new Date() });
  }

  private async validateDateRange(data: CreateHolidayDto | UpdateHolidayDto | any): Promise<void> {
    if (!data.start_date) {
      throw new BadRequestException('start_date is required');
    }
    const startDate = new Date(data.start_date);
    const endDate = data.end_date ? new Date(data.end_date) : null;

    if (isNaN(startDate.getTime())) throw new BadRequestException('start_date must be a valid date');
    if (endDate && isNaN(endDate.getTime())) throw new BadRequestException('end_date must be a valid date');
    if (endDate && startDate > endDate) throw new BadRequestException('start_date must be before or equal to end_date');

    if (endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (data.total_days !== undefined && data.total_days !== daysDiff) {
        throw new BadRequestException(`total_days (${data.total_days}) does not match date range (${daysDiff} days)`);
      }
    }
  }

  private async validateNoOverlap(data: CreateHolidayDto | UpdateHolidayDto | any, holidayId?: number): Promise<void> {
    const startDate = new Date(data.start_date);
    const endDate = data.end_date ? new Date(data.end_date) : startDate;

    const whereClause: any = {
      delete_time: null,
      start_date: LessThanOrEqual(endDate),
      end_date: MoreThanOrEqual(startDate),
    };

    if (holidayId) {
      whereClause.id = Not(holidayId);
    }

    const overlapping = await this.holidayRepository.find({ where: whereClause });
    if (overlapping.length > 0) {
      throw new BadRequestException('Holiday dates overlap with existing holiday');
    }
  }
}
