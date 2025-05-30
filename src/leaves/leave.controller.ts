import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import {
  CreateLeaveDto,
  UpdateLeaveDto,
  UpdateLeaveStatusDto,
  LeaveResponseDto,
} from './leave.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@ApiTags('Leaves')
@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) { }

  @Post()
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({ type: LeaveResponseDto })
  async create(
    @Body() dto: CreateLeaveDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const leave = await this.leaveService.createLeave(dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(leave);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [LeaveResponseDto] })
  async getMyLeaves(@Req() req: AuthenticatedRequest): Promise<LeaveResponseDto[]> {
    const leaves = await this.leaveService.getMyLeaves(req.user.id);
    return leaves.map(leave => this.leaveService.toLeaveResponseDto(leave));
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [LeaveResponseDto] })
  async getAllLeaves(@Req() req: AuthenticatedRequest): Promise<LeaveResponseDto[]> {
    const leaves = await this.leaveService.getAllLeaves(req.user.id);
    return leaves.map(leave => this.leaveService.toLeaveResponseDto(leave));
  }

  @Patch(':id/details')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveResponseDto })
  async updateDetails(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const updatedLeave = await this.leaveService.updateLeaveDetails(id, dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(updatedLeave);
  }

  @Patch(':id/status')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const updatedLeave = await this.leaveService.updateLeaveStatus(id, dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(updatedLeave);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: LeaveResponseDto })
  async delete(@Param('id') id: string): Promise<void> {
    await this.leaveService.deleteLeave(id);
    return;
  }
}
