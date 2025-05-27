import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
  } from 'typeorm';
  import { UserInfoEntity } from './users.entity';
import { FacilityStatus } from '../../constants/facility-status.enum';
  
  @Entity('facility_requests')
  export class FacilityRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column({ name: 'requester_id' })
    requesterId: string;
  
    @Column({
      type: 'enum',
      enum: FacilityStatus,
      default: FacilityStatus.PENDING,
    })
    status: FacilityStatus;
  
    @Column({ name: 'approved_by', nullable: true })
    approvedById?: string;
  
    @Column({ type: 'datetime', name: 'approved_at', nullable: true })
    approvedAt?: Date;
  
    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'update_time' })
    updateTime?: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'delete_time' })
    deleteTime?: Date;
  
    @ManyToOne(() => UserInfoEntity, user => user.facilityRequests)
    @JoinColumn({ name: 'requester_id' })
    requester: UserInfoEntity;
  
    @ManyToOne(() => UserInfoEntity, user => user.facilityApprovals)
    @JoinColumn({ name: 'approved_by' })
    approver?: UserInfoEntity;
  }
  