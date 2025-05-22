import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { LeaveType } from '../leave-type/leave-type.entity';
import { Holiday } from '../holiday/holiday.entity';

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.leaves)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @ManyToOne(() => LeaveType, leaveType => leaveType.leaves)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;

  @Column()
  leave_type_id: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column()
  total_days: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  approved_by: number;

  @ManyToOne(() => User, user => user.approvedLeaves)
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ nullable: true, type: 'timestamp' })
  approved_at: Date;

  @Column({ nullable: true, type: 'text' })
  rejected_reason: string;

  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => User, user => user.createdLeaves)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;

  @DeleteDateColumn()
  delete_time: Date | null;

  @ManyToOne(() => Holiday, holiday => holiday.leaves)
  @JoinColumn({ name: 'holiday_id' })
  holiday: Holiday;

  @Column({ nullable: true })
  holiday_id: number;
}
