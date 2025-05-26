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
import { LeaveTypeEntity } from './leave-type.entity';
import { UserInfoEntity } from './user-info.entity';
import { LeaveType } from '../../constants/leave-type.enum';

@Entity('leaves')
export class LeaveEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'user_id'})
  userId: string;

  @Column({
    type: 'enum',
    enum: LeaveType,
    name: 'leave_type_id'
  })
  leaveTypeId: LeaveType;

  @Column({name: 'start_date'})
  startDate: Date;

  @Column({name: 'end_date'})
  endDate: Date;

  @Column()
  reason: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: string;

  @Column({ nullable: true , name: 'total_days'})
  totalDays: number;

  @ManyToOne(() => UserInfoEntity, (user) => user.leaves)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserInfoEntity;

  @ManyToOne(() => LeaveTypeEntity, (type) => type.id)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveTypeEntity;

  @ManyToOne(() => UserInfoEntity, (user) => user.createdLeaves)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserInfoEntity;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ nullable: true , name: 'update_time'})
  updateTime?: Date;

  @DeleteDateColumn({ nullable: true , name: 'delete_time'})
  deleteTime?: Date;
}
