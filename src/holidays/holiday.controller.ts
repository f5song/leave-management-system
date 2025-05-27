import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto, UpdateHolidayDto, HolidayResponseDto } from './holiday.dto';
import { HolidayEntity } from '../database/entity/holidays.entity';

@Controller('holidays')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays: HolidayEntity[] = await this.holidayService.findAll();
    return holidays.map(holiday => new HolidayResponseDto(holiday));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.findOne(id);
    return new HolidayResponseDto(holiday);
  }

  @Post()
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.create(createHolidayDto);
    return new HolidayResponseDto(holiday);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.update(id, updateHolidayDto);
    return new HolidayResponseDto(holiday);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.holidayService.softDelete(id);
  }
}
