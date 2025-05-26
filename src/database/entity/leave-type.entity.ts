import { LeaveEntity } from './leave.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { LeaveType } from '../../constants/leave-type.enum';

@Entity('leavetypes')
export class LeaveTypeEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('enum', { enum: LeaveType, default: LeaveType.ANNUAL })
  name: LeaveType;
  
  @Column()
  color: string;

  @OneToMany(() => LeaveEntity, (leave) => leave.leaveType)
  leaves: LeaveEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime?: Date;

  @DeleteDateColumn({ name: 'delete_time', nullable: true })
  deleteTime?: Date;
}