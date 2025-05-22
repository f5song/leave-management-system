import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../database/entity/account.entity';
import { CreateAccountDto, UpdateAccountDto } from './account.validation';
import { AccountResponseDto } from './account-response.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) { }

  async validateUserId(userId: number): Promise<void> {
    const user = await this.accountRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
  }

  async validateGoogleId(googleId: string): Promise<void> {
    const existing = await this.accountRepository.findOne({ where: { google_id: googleId } });
    if (existing) {
      throw new BadRequestException(`Google ID ${googleId} already exists`);
    }
  }

  async validateEmail(email: string): Promise<void> {
    const existing = await this.accountRepository.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
  }

  async validateApprover(approvedBy: number): Promise<void> {
    if (!approvedBy) return;
    const user = await this.accountRepository.findOne({ where: { user_id: approvedBy } });
    if (!user) {
      throw new BadRequestException(`Approver with ID ${approvedBy} not found`);
    }
  }

  toResponseDto(account: AccountEntity): AccountResponseDto {
    return {
      id: account.id,
      user_id: account.user_id,
      google_id: account.google_id,
      email: account.email,
      approved_by: account.approved_by,
      created_at: account.created_at,
      updated_at: account.updated_at,
    };
  }

  async createAccount(data: CreateAccountDto): Promise<AccountResponseDto> {
    await this.validateUserId(data.user_id);
    await this.validateGoogleId(data.google_id);
    await this.validateEmail(data.email);
    await this.validateApprover(data.approved_by);

    const account = await this.accountRepository.save(data);
    return this.toResponseDto(account);
  }

  async getAccountById(id: number | string): Promise<AccountResponseDto> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const account = await this.accountRepository.findOne({ where: { id: numericId } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }
    return this.toResponseDto(account);
  }

  async getAllAccounts(): Promise<AccountResponseDto[]> {
    const accounts = await this.accountRepository.find();
    return accounts.map(acc => this.toResponseDto(acc));
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<AccountResponseDto> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const existing = await this.accountRepository.findOne({ where: { id: numericId } });
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

    const updated = await this.accountRepository.save({ ...existing, ...data });
    return this.toResponseDto(updated);
  }

  async deleteAccount(id: number): Promise<void> {
    const numericId = typeof id === 'string' ? Number(id) : id;
    const existing = await this.accountRepository.findOne({ where: { id: numericId } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${numericId} not found`);
    }

    // ตรวจสอบว่ามีการใช้งาน account นี้อยู่หรือไม่ก่อนลบ
    const hasReferences = await this.accountRepository.findOne({
      where: { approved_by: numericId }
    });

    if (hasReferences) {
      throw new BadRequestException('Cannot delete account that is being used');
    }

    await this.accountRepository.delete(numericId);
  }
}
