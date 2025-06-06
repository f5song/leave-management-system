import { LeaveEntity } from './leaves.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { ELeaveType } from '@common/constants/leave-type.enum';

@Entity('leave_types')
export class LeaveTypeEntity {

  @PrimaryColumn('enum', { enum: ELeaveType, default: ELeaveType.ANNUAL })
  id: ELeaveType;

  @Column()
  name: string;

  @Column()
  description?: string;

  @OneToMany(() => LeaveEntity, (leave) => leave.leaveType)
  leaves: LeaveEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}