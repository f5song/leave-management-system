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
    await this.findOne(id);

    return this.prisma.holiday.update({
      where: { id },
      data: {
        ...data,
        update_time: new Date(),
      },
    });
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
