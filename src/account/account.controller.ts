import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() accountData: CreateAccountDto) {
    return this.accountService.createAccount(accountData);
  }

  @Get(':id')
  async getAccountById(@Param('id') id: number) {
    return this.accountService.getAccountById(id);
  }

  @Get()
  async getAllAccounts() {
    return this.accountService.getAllAccounts();
  }

  @Put(':id')
  async updateAccount(@Param('id') id: number, @Body() accountData: UpdateAccountDto) {
    return this.accountService.updateAccount(id, accountData);
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: number) {
    return this.accountService.deleteAccount(id);
  }
}
