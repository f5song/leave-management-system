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

  async validateUserId(userId: string): Promise<void> {
    const user = await this.accountRepository.findOne({ where: { userId: userId } });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
  }

  async validateGoogleId(googleId: string): Promise<void> {
    const existing = await this.accountRepository.findOne({ where: { googleId: googleId } });
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

  async validateApprover(approvedById?: string): Promise<void> {
    if (!approvedById) return;
    const user = await this.accountRepository.findOne({ where: { userId: approvedById } });
    if (!user) {
      throw new BadRequestException(`Approver with ID ${approvedById} not found`);
    }
  }

  toResponseDto(account: AccountEntity): AccountResponseDto {
    return {
      id: account.id,
      userId: account.userId,
      googleId: account.googleId,
      email: account.email,
      approvedById: account.approvedById,
      createdAt: account.createdAt,
      updateTime: account.updateTime,
    };
  }

  async createAccount(data: CreateAccountDto): Promise<AccountResponseDto> {
    await this.validateUserId(data.userId);
    await this.validateGoogleId(data.googleId);
    await this.validateEmail(data.email);
    await this.validateApprover(data.approvedById);

    const account = await this.accountRepository.save(data);
    return this.toResponseDto(account);
  }

  async getAccountById(id: string): Promise<AccountResponseDto> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return this.toResponseDto(account);
  }

  async getAllAccounts(): Promise<AccountResponseDto[]> {
    const accounts = await this.accountRepository.find();
    return accounts.map(acc => this.toResponseDto(acc));
  }

  async updateAccount(id: string, data: UpdateAccountDto): Promise<AccountResponseDto> {
    const existing = await this.accountRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    if (data.googleId && data.googleId !== existing.googleId) {
      await this.validateGoogleId(data.googleId);
    }

    if (data.email && data.email !== existing.email) {
      await this.validateEmail(data.email);
    }

    if (data.approvedById) {
      await this.validateApprover(data.approvedById);
    }

    const updated = await this.accountRepository.save({ ...existing, ...data });
    return this.toResponseDto(updated);
  }

  async deleteAccount(id: string): Promise<void> {
    const existing = await this.accountRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    // ตรวจสอบว่ามีการใช้งาน account นี้อยู่หรือไม่ก่อนลบ
    const hasReferences = await this.accountRepository.findOne({
      where: { approvedById: id }
    });

    if (hasReferences) {
      throw new BadRequestException('Cannot delete account that is being used');
    }

    await this.accountRepository.delete(id);
  }
}
