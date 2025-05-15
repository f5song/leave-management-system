import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) { }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({ data });
  }

  async getAccountById(id: number | string): Promise<Account> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const account = await this.prisma.account.findUnique({ where: { id: numericId } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }
    return account;
  }

  async getAllAccounts(): Promise<Account[]> {
    return this.prisma.account.findMany();
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const existing = await this.prisma.account.findUnique({ where: { id: numericId } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }
    return this.prisma.account.update({ where: { id: numericId }, data });
  }

  async deleteAccount(id: number): Promise<Account> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const existing = await this.prisma.account.findUnique({ where: { id: numericId } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }
    return this.prisma.account.delete({ where: { id: numericId } });
  }
}
