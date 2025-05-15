import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInfo } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<UserInfo> {
    return this.prisma.userInfo.create({ data });
  }

  async getUserById(id: number): Promise<UserInfo> {
    const user = await this.prisma.userInfo.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsers(): Promise<UserInfo[]> {
    return this.prisma.userInfo.findMany();
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<UserInfo> {
    return this.prisma.userInfo.update({ where: { id: userId }, data });
  }

  async partialUpdateUser(id: number, partialData: Partial<UpdateUserDto>): Promise<UserInfo> {
    const existingUser = await this.getUserById(id); // ถ้าไม่เจอจะ throw NotFoundException

    return this.prisma.userInfo.update({
      where: { id },
      data: {
        ...partialData, // Prisma จะอัปเดตเฉพาะฟิลด์ที่มีอยู่ใน partialData
      },
    });
  }

  async deleteUser(id: number): Promise<UserInfo> {
    return this.prisma.userInfo.delete({ where: { id } });
  }

  // คุณสามารถเติม method นี้ในภายหลังได้
  findByEmail(email: string) {
    throw new Error('Method not implemented.');
  }
}
