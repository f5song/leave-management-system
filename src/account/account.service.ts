import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) { }

  async validateUserId(userId: number): Promise<void> {
    const user = await this.prisma.userInfo.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
  }

  async validateGoogleId(googleId: string): Promise<void> {
    const existing = await this.prisma.account.findUnique({ where: { google_id: googleId } });
    if (existing) {
      throw new BadRequestException(`Google ID ${googleId} already exists`);
    }
  }

  async validateEmail(email: string): Promise<void> {
    const existing = await this.prisma.account.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
  }

  async validateApprover(approvedBy: number): Promise<void> {
    if (!approvedBy) return;
    const user = await this.prisma.userInfo.findUnique({ where: { id: approvedBy } });
    if (!user) {
      throw new BadRequestException(`Approver with ID ${approvedBy} not found`);
    }
  }

  async createAccount(data: CreateAccountDto): Promise<Account> {
    await this.validateUserId(data.user_id);
    await this.validateGoogleId(data.google_id);
    await this.validateEmail(data.email);
    await this.validateApprover(data.approved_by);

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

    if (data.google_id && data.google_id !== existing.google_id) {
      await this.validateGoogleId(data.google_id);
    }

    if (data.email && data.email !== existing.email) {
      await this.validateEmail(data.email);
    }

    if (data.approved_by) {
      await this.validateApprover(data.approved_by);
    }

    return this.prisma.account.update({ where: { id: numericId }, data });
  }

  async deleteAccount(id: number): Promise<Account> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const existing = await this.prisma.account.findUnique({ where: { id: numericId } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }

    // ตรวจสอบว่ามีการใช้งาน account นี้อยู่หรือไม่ก่อนลบ
    const hasReferences = await this.prisma.account.findFirst({
      where: {
        OR: [
          { approved_by: numericId },
        ]
      }
    });

    if (hasReferences) {
      throw new BadRequestException('Cannot delete account that is being used');
    }

    return this.prisma.account.delete({ where: { id: numericId } });
  }
}
