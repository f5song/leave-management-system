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

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  async create(
    @Body() dto: CreateLeaveDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const leave = await this.leaveService.createLeave(dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(leave);
  }

  @Get('me')
  async getMyLeaves(@Req() req: AuthenticatedRequest): Promise<LeaveResponseDto[]> {
    const leaves = await this.leaveService.getMyLeaves(req.user.id);
    return leaves.map(leave => this.leaveService.toLeaveResponseDto(leave));
  }

  @Get()
  async getAllLeaves(@Req() req: AuthenticatedRequest): Promise<LeaveResponseDto[]> {
    const leaves = await this.leaveService.getAllLeaves(req.user.id);
    return leaves.map(leave => this.leaveService.toLeaveResponseDto(leave));
  }

  @Patch(':id/details')
  async updateDetails(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const updatedLeave = await this.leaveService.updateLeaveDetails(id, dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(updatedLeave);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLeaveStatusDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<LeaveResponseDto> {
    const updatedLeave = await this.leaveService.updateLeaveStatus(id, dto, req.user.id);
    return this.leaveService.toLeaveResponseDto(updatedLeave);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.leaveService.deleteLeave(id);
    return;
  }
}
