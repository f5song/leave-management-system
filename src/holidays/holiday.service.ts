import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { HolidayEntity } from '../database/entity/holidays.entity';
import { CreateHolidayDto, UpdateHolidayDto, HolidayResponseDto } from './holiday.dto';

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
      startDate: holiday.startDate,
      endDate: holiday.endDate,
      totalDays: holiday.totalDays,
      color: holiday.color,
      createdAt: holiday.createdAt,
      updatedAt: holiday.updatedAt,
      deletedAt: holiday.deletedAt,
    };
  }

  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays = await this.holidayRepository.find({
      where: { deletedAt: null },
      order: { startDate: 'ASC' },
    });
    return holidays.map(h => this.toResponseDto(h));
  }

  async findOne(id: string): Promise<HolidayResponseDto> {
    const holiday = await this.holidayRepository.findOne({
      where: { id, deletedAt: null },
    });
    if (!holiday) throw new NotFoundException(`Holiday with id ${id} not found`);
    return this.toResponseDto(holiday);
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
    return this.toResponseDto(holiday);
  }

  async update(id: string, updateHolidayDto: UpdateHolidayDto): Promise<HolidayResponseDto> {
    const holidayEntity = await this.holidayRepository.findOne({ where: { id, deletedAt: null } });
    if (!holidayEntity) throw new NotFoundException(`Holiday with id ${id} not found`);

    const updatedData = {
      ...holidayEntity,
      ...updateHolidayDto,
      startDate: updateHolidayDto.startDate ? new Date(updateHolidayDto.startDate) : holidayEntity.startDate,
      endDate: updateHolidayDto.endDate ? new Date(updateHolidayDto.endDate) : holidayEntity.endDate,
    };

    await this.validateDateRange(updatedData);
    await this.validateNoOverlap(updatedData, id);

    const updatedHoliday = await this.holidayRepository.save(updatedData);
    return this.toResponseDto(updatedHoliday);
  }

  async softDelete(id: string): Promise<void> {
    const holiday = await this.holidayRepository.findOne({ where: { id, deletedAt: null } });
    if (!holiday) throw new NotFoundException(`Holiday with id ${id} not found`);

    await this.holidayRepository.update(id, { deletedAt: new Date() });
  }

  private async validateDateRange(data: CreateHolidayDto | UpdateHolidayDto | any): Promise<void> {
    if (!data.startDate) {
      throw new BadRequestException('startDate is required');
    }
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (isNaN(startDate.getTime())) throw new BadRequestException('startDate must be a valid date');
    if (endDate && isNaN(endDate.getTime())) throw new BadRequestException('endDate must be a valid date');
    if (endDate && startDate > endDate) throw new BadRequestException('startDate must be before or equal to endDate');

    if (endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (data.totalDays !== undefined && data.totalDays !== daysDiff) {
        throw new BadRequestException(`totalDays (${data.totalDays}) does not match date range (${daysDiff} days)`);
      }
    }
  }

  private async validateNoOverlap(data: CreateHolidayDto | UpdateHolidayDto | any, holidayId?: string): Promise<void> {
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
      throw new BadRequestException('Holiday dates overlap with existing holiday');
    }
  }
}
