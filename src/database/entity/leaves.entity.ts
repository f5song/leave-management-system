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
import { ELeaveType } from '@common/constants/leave-type.enum';
import { ELeaveStatus } from '@common/constants/leave-status.enum';

@Entity('leaves')
export class LeaveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'start_date', type: 'datetime'})
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime'})
  endDate: Date;

  @Column({ name: 'total_days', type: 'int', nullable: true })
  totalDays: number;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'leave_type_id'
  })
  leaveTypeId: ELeaveType;

  @Column({
    type: 'enum',
    enum: ELeaveStatus,
    default: ELeaveStatus.PENDING,
  })
  status?: ELeaveStatus;

  @Column({ name: 'action_by', type: 'uuid', nullable: true })
  actionBy?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'action_by' })
  actionByUser?: UserEntity;

  @ManyToOne(() => UserEntity, user => user.leaves)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserEntity;

  @ManyToOne(() => LeaveTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveTypeEntity;

  @CreateDateColumn({ name: 'action_at'})
  actionAt: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById?: string;

  @ManyToOne(() => UserEntity, (user) => user.createdLeaves)
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
