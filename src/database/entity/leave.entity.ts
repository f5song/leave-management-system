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

@Entity('leaves')
export class LeaveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  leave_type_id: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  reason: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  total_days: number;

  @ManyToOne(() => UserInfoEntity, (user) => user.leaves)
  @JoinColumn({ name: 'user_id' })
  userInfo: UserInfoEntity;

  @ManyToOne(() => LeaveTypeEntity, (type) => type.leaves)
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveTypeEntity;

  @ManyToOne(() => UserInfoEntity, (user) => user.createdLeaves)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserInfoEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
    user: any;
    existingLeave: { id: string; };
}
