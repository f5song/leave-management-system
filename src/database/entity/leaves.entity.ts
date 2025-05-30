import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { LeaveTypeEntity } from './leave-types.entity';
import { UserEntity } from './users.entity';
import { LeaveType } from '../../constants/leave-type.enum';
import { LeaveStatus } from '../../constants/leave-status.enum';

@Entity('leaves')
export class LeaveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, user => user.leaves)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserEntity;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'total_days', type: 'int', nullable: true })
  totalDays: number;

  @Column({
    type: 'enum',
    enum: LeaveType,
    name: 'leave_type_id'
  })
  leaveTypeId: LeaveType;

  @ManyToOne(() => LeaveTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveTypeEntity;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status: LeaveStatus;

  @Column({ name: 'action_by', type: 'uuid', nullable: true })
  actionBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'action_by' })
  actionByUser?: UserEntity;

  @CreateDateColumn({ name: 'action_at'})
  actionAt: Date;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity, (user) => user.createdLeaves)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
