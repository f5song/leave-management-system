import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn
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

  @Column({ name: 'created_by', nullable: true })
  createdById?: string;

  @CreateDateColumn({ type: 'datetime' , name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true , name: 'updated_at'})
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true , name: 'deleted_at'})
  deletedAt?: Date;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, user => user.createdHolidays)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy?: UserEntity;
}
