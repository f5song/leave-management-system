import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './account.validation';
import { AccountResponseDto } from './account-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('accounts')
@UsePipes(new ValidationPipe({ transform: true }))
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() accountData: CreateAccountDto): Promise<AccountResponseDto> {
    return this.accountService.createAccount(accountData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAccountById(@Param('id', ParseIntPipe) id: number): Promise<AccountResponseDto> {
    return this.accountService.getAccountById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAccounts(): Promise<AccountResponseDto[]> {
    return this.accountService.getAllAccounts();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() accountData: UpdateAccountDto
  ): Promise<AccountResponseDto> {
    return this.accountService.updateAccount(id, accountData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.accountService.deleteAccount(id);
    return { message: 'Account deleted successfully' };
  }
}
