import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto, UpdateHolidayDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  findAll() {
    return this.holidayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.holidayService.findOne(id);
  }

  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ) {
    return this.holidayService.update(id, updateHolidayDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.holidayService.softDelete(id);
  }
}
