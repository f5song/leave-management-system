import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UsersItemRequestEntity } from './users-items-requests.entity';
import { UserEntity } from './users.entity';
import { ItemRequestStatus } from '../../constants/item-request-status.enum';

@Entity('users_items_requests_history')
export class UsersItemsRequestsHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: false })
  requestId: string;

  @ManyToOne(() => UsersItemRequestEntity, (request) => request.history)
  @JoinColumn({ name: 'request_id' })
  request: UsersItemRequestEntity;

  @Column('uuid', { nullable: true })
  actionBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.actionedRequestsHistory)
  @JoinColumn({ name: 'action_by' })
  actionedBy: UserEntity;

  @Column('enum', { enum: ItemRequestStatus, nullable: false })
  actionType: ItemRequestStatus;

  @Column('enum', { enum: ItemRequestStatus, nullable: false })
  oldStatus: ItemRequestStatus;

  @CreateDateColumn({ name: 'action_at', default: () => 'CURRENT_TIMESTAMP' })
  actionAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}