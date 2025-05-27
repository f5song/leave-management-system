import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
  } from 'typeorm';
  import { UserEntity } from './users.entity';
import { FacilityStatus } from '../../constants/facility-status.enum';
  
  @Entity('users_facility_requests')
  export class FacilityRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column({ name: 'requested_by', type: 'uuid' })
    requestedById: string;
  
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
  
    @Column({ type: 'datetime', nullable: true, name: 'updated_at' })
    updatedAt?: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    deletedAt?: Date;
  
    @ManyToOne(() => UserEntity, user => user.facilityRequests)
    @JoinColumn({ name: 'requested_by' })
    requestedBy: UserEntity;
  
    @ManyToOne(() => UserEntity, user => user.facilityApprovals)
    @JoinColumn({ name: 'approved_by' })
    approvedBy?:  UserEntity;
  }
  