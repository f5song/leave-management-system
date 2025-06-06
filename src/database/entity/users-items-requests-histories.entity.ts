import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsersItemRequestEntity } from './users-items-requests.entity';
import { UserEntity } from './users.entity';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';

@Entity('users_items_requests_history')
export class UsersItemsRequestsHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  requestId: string;

  @Column('uuid', { nullable: true })
  actionBy: UserEntity;

  @Column('enum', { enum: EItemRequestStatus, nullable: false })
  actionType: EItemRequestStatus;

  @CreateDateColumn({ name: 'action_at'})
  actionAt: Date;

  @Column()
  borrow_start_date: Date;

  @Column()
  borrow_end_date: Date;

  @ManyToOne(() => UsersItemRequestEntity, (request) => request.history)
  @JoinColumn({ name: 'request_id' })
  request: UsersItemRequestEntity;

  @ManyToOne(() => UserEntity, (user) => user.actionedRequestsHistory)
  @JoinColumn({ name: 'action_by' })
  actionedBy: UserEntity;

}