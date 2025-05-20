import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Holiday } from '@prisma/client';
import { CreateHolidayDto, UpdateHolidayDto } from './dto';

@Injectable()
export class HolidayService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Holiday[]> {
    return this.prisma.holiday.findMany({
      where: { delete_time: null },
      orderBy: { start_date: 'asc' },
    });
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.prisma.holiday.findFirst({
      where: { id, delete_time: null },
    });

    if (!holiday) {
      throw new NotFoundException(`Holiday with id ${id} not found`);
    }

    return holiday;
  }

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    return this.prisma.holiday.create({ data: createHolidayDto });
  }

  async update(id: number, updateHolidayDto: UpdateHolidayDto): Promise<Holiday> {
    await this.findOne(id);

    return this.prisma.holiday.update({
      where: { id },
      data: {
        ...updateHolidayDto,
        update_time: new Date(),
      },
    });
  }

  async partialUpdate(id: number, data: Partial<UpdateHolidayDto>): Promise<Holiday> {
    await this.validateHolidayId(id);
    await this.validateDateRange(data);
    await this.validateNoOverlap(data, id);

    return this.prisma.holiday.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
  }

  async validateHolidayId(id: number): Promise<void> {
    const holiday = await this.prisma.holiday.findFirst({
      where: { id, delete_time: null },
    });
    if (!holiday) {
      throw new NotFoundException(`Holiday with id ${id} not found`);
    }
  }

  async validateDateRange(data: Partial<UpdateHolidayDto>): Promise<void> {
    if (data.start_date && data.end_date) {
      if (data.start_date > data.end_date) {
        throw new Error('Start date cannot be after end date');
      }
    }
  }

  async validateNoOverlap(data: Partial<UpdateHolidayDto>, holidayId?: number): Promise<void> {
    if (!data.start_date || !data.end_date) return;

    const holidays = await this.prisma.holiday.findMany({
      where: {
        delete_time: null,
        AND: [
          {
            OR: [
              {
                start_date: {
                  lte: data.end_date,
                  gte: data.start_date,
                },
              },
              {
                end_date: {
                  lte: data.end_date,
                  gte: data.start_date,
                },
              },
            ],
          },
        ],
        ...(holidayId ? { id: { not: holidayId } } : {}),
      },
    });

    if (holidays.length > 0) {
      throw new Error('Holiday dates overlap with existing holiday');
    }
  }

  async softDelete(id: number): Promise<Holiday> {
    await this.findOne(id);

    return this.prisma.holiday.update({
      where: { id },
      data: {
        delete_time: new Date(),
      },
    });
  }
}
