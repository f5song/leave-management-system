import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // ปรับ path ตามโปรเจค
import { LeaveType } from '@prisma/client';

@Injectable()
export class LeaveTypeService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<LeaveType[]> {
        return this.prisma.leaveType.findMany({
            where: { delete_time: null },
        });
    }

    async findOne(id: string): Promise<LeaveType | null> {
        return this.prisma.leaveType.findFirst({
            where: { id, delete_time: null },
        });
    }

    async create(data: { id: string; name: string }): Promise<LeaveType> {
        return this.prisma.leaveType.create({
            data,
        });
    }

    async update(id: string, data: { name?: string }): Promise<LeaveType> {
        return this.prisma.leaveType.update({
            where: { id },
            data: {
                ...data,
                update_time: new Date(),
            },
        });
    }

    async softDelete(id: string): Promise<LeaveType> {
        return this.prisma.leaveType.update({
            where: { id },
            data: {
                delete_time: new Date(),
            },
        });
    }
    async partialUpdate(id: string, data: Partial<{ name: string }>): Promise<LeaveType> {
        return this.prisma.leaveType.update({
            where: { id },
            data: {
                ...data,
                update_time: new Date(),
            },
        });
    }

}
