import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto} from './dto/create.holidays.dto';
import { UpdateHolidayDto } from './dto/update.holidays.dto';
import { HolidayResponseDto } from './dto/holidays.respones.dto';
import { HolidayEntity } from '../../database/entity/holidays.entity';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/guards/roles-permission.decorator';

@ApiTags('Holidays')
@Controller('holidays')
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [HolidayResponseDto] })
  async findAll(): Promise<HolidayResponseDto[]> {
    const holidays: HolidayEntity[] = await this.holidayService.findAll();
    return holidays.map(holiday => this.holidayService.toHolidayResponseDto(holiday));
  }

  @Get(':id')
  @Roles('admin', 'employee')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: HolidayResponseDto })
  async findOne(@Param('id') id: string): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.findOne(id);
    return this.holidayService.toHolidayResponseDto(holiday);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: HolidayResponseDto })
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.create(createHolidayDto);
    return this.holidayService.toHolidayResponseDto(holiday);
  }

  @Put(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: HolidayResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ): Promise<HolidayResponseDto> {
    const holiday: HolidayEntity = await this.holidayService.update(id, updateHolidayDto);
    return this.holidayService.toHolidayResponseDto(holiday);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: HolidayResponseDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string): Promise<void> {
    await this.holidayService.softDelete(id);
  }
}
