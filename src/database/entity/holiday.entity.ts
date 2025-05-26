import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';

@Entity('holidays')
export class HolidayEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'datetime', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'datetime', name: 'end_date' })
  endDate: Date;

  @Column({ name: 'total_days' })
  totalDays: number;

  @Column()
  color: string;

  @Column({ name: 'created_by' })
  createdById?: string;

  @CreateDateColumn({ type: 'datetime' , name: 'created_at'})
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true , name: 'update_time'})
  updateTime?: Date;

  @Column({ type: 'datetime', nullable: true , name: 'delete_time'})
  deleteTime?: Date;

  @ManyToOne(() => UserInfoEntity, user => user.createdHolidays)
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserInfoEntity;
}
