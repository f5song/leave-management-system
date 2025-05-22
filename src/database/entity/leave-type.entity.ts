import { LeaveEntity } from './leave.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, OneToMany } from 'typeorm';

@Entity('leavetypes')
export class LeaveTypeEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => LeaveEntity, (leave) => leave.leaveType)
  leaves: LeaveEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  update_time?: Date;

  @DeleteDateColumn({ nullable: true })
  delete_time?: Date;
}