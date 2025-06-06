import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany
} from 'typeorm';
import { UsersItemEntity } from './users-items.entity';
import { UserEntity } from './users.entity';
import { EItemRequestStatus } from '@common/constants/item-request-status.enum';
import { UsersItemsRequestsHistoryEntity } from './users-items-requests-histories.entity';

@Entity('users_item_requests')
export class UsersItemRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column({
    type: 'enum',
    enum: EItemRequestStatus,
    default: EItemRequestStatus.PENDING,
  })
  status: EItemRequestStatus;

  @Column()
  quantity: number;


  @CreateDateColumn({ name: 'action_at' })
  actionAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'requested_by' })
  requestedById: string;


  @OneToMany(() => UsersItemsRequestsHistoryEntity, history => history.request)
  history: UsersItemsRequestsHistoryEntity[];

  @ManyToOne(() => UsersItemEntity, item => item.itemRequests)
  @JoinColumn({ name: 'item_id' })
  item: UsersItemEntity;

  @ManyToOne(() => UserEntity, user => user.itemRequests)
  @JoinColumn({ name: 'requested_by' })
  requestedBy: UserEntity;

  @ManyToOne(() => UserEntity, user => user.itemApprovals)
  @JoinColumn({ name: 'approved_by' })
  approvedBy: UserEntity;

}
