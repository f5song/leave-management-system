import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';

@Entity('holidays')
export class HolidayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column()
  total_days: number;

  @Column()
  color: string;

  @Column({ nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  update_time?: Date;

  @Column({ type: 'datetime', nullable: true })
  delete_time?: Date;

  @ManyToOne(() => UserInfo, user => user.createdHolidays)
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserInfo;
}
