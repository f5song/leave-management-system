import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { UserEntity } from './users.entity';

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

  @Column({ type: 'datetime', nullable: true , name: 'updated_at'})
  updatedAt?: Date;

  @Column({ type: 'datetime', nullable: true , name: 'deleted_at'})
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, user => user.createdHolidays)
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity;
}
