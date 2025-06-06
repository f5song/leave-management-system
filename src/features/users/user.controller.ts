import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.users.dto';
import { UserResponseDto } from './dto/users.respones.dto';
import { UpdateUserDto } from './dto/update.users.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  async createUser(@Body() userData: CreateUserDto): Promise<UserResponseDto> {
    const userEntity = await this.userService.createUser(userData);
    return this.userService.toUserResponseDto(userEntity);
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)

  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const userEntity = await this.userService.getUserById(id);
    return this.userService.toUserResponseDto(userEntity);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: [UserResponseDto] })
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<UserResponseDto[]> {
    const userEntities = await this.userService.getAllUsers();
    return userEntities.map(entity => this.userService.toUserResponseDto(entity));
  }

  @Put(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await this.userService.updateUser(id, updateData);
    return this.userService.toUserResponseDto(updatedUser);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  async patchUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto
  ): Promise<UserResponseDto> {
    const updatedUser = await this.userService.patchUser(id, updateData);
    return this.userService.toUserResponseDto(updatedUser);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponseDto })
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    const deletedUser = await this.userService.deleteUser(id);
    return this.userService.toUserResponseDto(deletedUser);
  }
}
