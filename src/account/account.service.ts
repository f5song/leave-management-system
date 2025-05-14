import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async getAccountById(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    const existing = await this.prisma.account.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return this.prisma.account.update({ where: { id }, data });
  }

  async deleteAccount(id: number): Promise<Account> {
    const existing = await this.prisma.account.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return this.prisma.account.delete({ where: { id } });
  }
}
