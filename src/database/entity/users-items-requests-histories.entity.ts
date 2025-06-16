import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsersItemRequestEntity } from './users-items-requests.entity';
import { UserEntity } from './users.entity';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';

@Entity('users_items_requests_histories')
export class UsersItemsRequestsHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersItemRequestEntity, (request) => request.history)
  @JoinColumn({ name: 'request_id' })
  request?: UsersItemRequestEntity;

  @Column('uuid', { nullable: true , name: 'request_id'})
  requestId?: string;

  @Column('enum', { enum: EItemRequestStatus, nullable: false })
  actionType: EItemRequestStatus;

  @CreateDateColumn({ name: 'action_at' })
  actionAt: Date;

  @Column({ nullable: true })
  borrow_start_date?: Date;

  @Column({ nullable: true })
  borrow_end_date?: Date;

  @Column('uuid', { name: 'action_by', nullable: true })
  actionById?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'action_by' })
  actionedBy?: UserEntity;


}