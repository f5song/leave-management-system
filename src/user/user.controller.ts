import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() userData: CreateUserDto) {
    return this.userService.createUser({
      ...userData,
      role_id: Number(userData.role_id),
      job_title_id: String(userData.job_title_id),
      department_id: String(userData.department_id),
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() userData: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, userData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async partialUpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialData: Partial<UpdateUserDto>,
  ) {
    return this.userService.partialUpdateUser(id, partialData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
