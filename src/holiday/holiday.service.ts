import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    // Validate dates
    if (!createHolidayDto.start_date) {
      throw new BadRequestException('start_date is required');
    }

    // Convert date strings to Date objects
    const startDate = new Date(createHolidayDto.start_date);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('start_date must be a valid date');
    }

    const endDate = createHolidayDto.end_date ? new Date(createHolidayDto.end_date) : null;
    if (endDate && isNaN(endDate.getTime())) {
      throw new BadRequestException('end_date must be a valid date');
    }

    if (endDate && startDate > endDate) {
      throw new BadRequestException('start_date must be before or equal to end_date');
    }

    // Validate total_days matches date range
    if (endDate) {
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (createHolidayDto.total_days !== daysDiff) {
        throw new BadRequestException(`total_days (${createHolidayDto.total_days}) does not match date range (${daysDiff} days)`);
      }
    }

    // Validate title
    if (!createHolidayDto.title || typeof createHolidayDto.title !== 'string') {
      throw new BadRequestException('title must be a string');
    }
    if (createHolidayDto.title.length < 2) {
      throw new BadRequestException('title must be at least 2 characters');
    }
    if (createHolidayDto.title.length > 100) {
      throw new BadRequestException('title cannot exceed 100 characters');
    }

    // Validate total_days
    if (createHolidayDto.total_days <= 0) {
      throw new BadRequestException('total_days must be greater than 0');
    }

    // Validate color
    if (!createHolidayDto.color || typeof createHolidayDto.color !== 'string') {
      throw new BadRequestException('color must be a string');
    }

    // Check for overlapping holidays
    const overlappingHolidays = await this.prisma.holiday.findMany({
      where: {
        AND: [
          { delete_time: null },
          {
            OR: [
              {
                start_date: {
                  lte: createHolidayDto.end_date || createHolidayDto.start_date
                },
                end_date: {
                  gte: createHolidayDto.start_date
                }
              }
            ]
          }
        ]
      }
    });

    if (overlappingHolidays.length > 0) {
      throw new BadRequestException('Holiday overlaps with existing holiday');
    }

    // Check if holiday with same id already exists
    if (createHolidayDto.id) {
      const existingHoliday = await this.prisma.holiday.findUnique({
        where: { id: createHolidayDto.id },
        select: { id: true }
      });
      if (existingHoliday) {
        throw new BadRequestException(`Holiday with id ${createHolidayDto.id} already exists`);
      }
    }

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
