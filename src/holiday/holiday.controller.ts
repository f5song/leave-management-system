import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from './holiday.validation';
import { HolidayResponseDto } from './holiday-response.dto';

@Controller('holidays')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async findAll(): Promise<HolidayResponseDto[]> {
    return this.holidayService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<HolidayResponseDto> {
    return this.holidayService.findOne(id);
  }

  @Post()
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    return this.holidayService.create(createHolidayDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ): Promise<HolidayResponseDto> {
    return this.holidayService.update(id, updateHolidayDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.holidayService.softDelete(id);
  }
}
