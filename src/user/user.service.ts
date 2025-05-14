import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserInfo } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

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

    async deleteUser(id: number): Promise<UserInfo> {
        return this.prisma.userInfo.delete({ where: { id } });
    }
}
