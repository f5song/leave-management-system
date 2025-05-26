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
  import { CreateLeaveDto, UpdateLeaveDto, UpdateLeaveStatusDto } from './leave.validation';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { LeaveEntity } from '../database/entity/leave.entity';
  interface AuthenticatedRequest extends Request {
    user: { id: string };
  }
  
  @UseGuards(JwtAuthGuard)
  @Controller('leaves')
  export class LeaveController {
    constructor(private readonly leaveService: LeaveService) {}
  
    @Post()
    create(@Body() dto: CreateLeaveDto, @Req() req: AuthenticatedRequest) {
      return this.leaveService.createLeave(dto, req.user.id);
    }
  
    @Get('me')
    getMyLeaves(@Req() req: AuthenticatedRequest) {
      return this.leaveService.getMyLeaves(req.user.id);
    }
  
    @Get()
    getAllLeaves(@Req() req: AuthenticatedRequest) {
      return this.leaveService.getAllLeaves(req.user.id);
    }
  
    @Patch(':id/details')
    updateDetails(
      @Param('id') id: string,
      @Body() dto: UpdateLeaveDto,
      @Req() req: AuthenticatedRequest,
    ) {
      return this.leaveService.updateLeaveDetails(id, dto, req.user.id);
    }

    @Patch(':id/status')
    updateStatus(
      @Param('id') id: string,
      @Body() dto: UpdateLeaveStatusDto,
      @Req() req: AuthenticatedRequest,
    ) {
      return this.leaveService.updateLeaveStatus(id, dto, req.user.id);
    }
  
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.leaveService.deleteLeave(id);
    }
  }