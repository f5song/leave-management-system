import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaveType } from '@prisma/client';

@Injectable()
export class LeaveTypeService {
    constructor(private prisma: PrismaService) { }

    private async validateLeaveTypeId(id: string): Promise<void> {
        if (!id || typeof id !== 'string' || id.length > 20) {
            throw new BadRequestException('Leave type ID must be a string with maximum length of 20 characters');
        }

        const existingType = await this.prisma.leaveType.findUnique({
            where: { id },
        });

        if (existingType && !existingType.delete_time) {
            throw new BadRequestException(`Leave type with ID ${id} already exists`);
        }
    }

    private async validateLeaveTypeName(name: string): Promise<void> {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new BadRequestException('Leave type name is required and cannot be empty');
        }

        const existingType = await this.prisma.leaveType.findFirst({
            where: {
                name: name.trim(),
                delete_time: null,
            },
        });

        if (existingType) {
            throw new BadRequestException(`Leave type with name ${name} already exists`);
        }
    }

    private async validateLeaveTypeExists(id: string): Promise<void> {
        const leaveType = await this.prisma.leaveType.findUnique({
            where: { id },
        });

        if (!leaveType || leaveType.delete_time) {
            throw new NotFoundException(`Leave type with ID ${id} not found`);
        }
    }

    async findAll(): Promise<LeaveType[]> {
        return this.prisma.leaveType.findMany({
            where: { delete_time: null },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string): Promise<LeaveType | null> {
        await this.validateLeaveTypeExists(id);
        return this.prisma.leaveType.findFirst({
            where: { id, delete_time: null },
        });
    }

    async create(data: { id: string; name: string }): Promise<LeaveType> {
        await this.validateLeaveTypeId(data.id);
        await this.validateLeaveTypeName(data.name);

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
