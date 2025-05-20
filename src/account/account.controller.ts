import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() accountData: CreateAccountDto) {
    return this.accountService.createAccount(accountData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAccountById(@Param('id') id: number) {
    return this.accountService.getAccountById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAccounts() {
    return this.accountService.getAllAccounts();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAccount(@Param('id') id: number, @Body() accountData: UpdateAccountDto) {
    return this.accountService.updateAccount(id, accountData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Param('id') id: number) {
    return this.accountService.deleteAccount(id);
  }
}
