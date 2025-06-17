import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany,
  DeleteDateColumn,
  UpdateDateColumn
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

  @Column({ type: 'enum', enum: EItemRequestStatus, default: EItemRequestStatus.PENDING })
  status: EItemRequestStatus;

  @Column()
  quantity: number;

  @Column({ name: 'approved_by', nullable: true })
  approvedById?: string;

  @CreateDateColumn({ name: 'action_at' })
  actionAt?: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'requested_by' })
  requestedById?: string;

  @ManyToOne(() => UserEntity, user => user.itemRequests)
  @JoinColumn({ name: 'requested_by' })
  requestedBy?: UserEntity;

  @OneToMany(() => UsersItemsRequestsHistoryEntity, history => history.request)
  history?: UsersItemsRequestsHistoryEntity[];

  @ManyToOne(() => UsersItemEntity, item => item.itemRequests)
  @JoinColumn({ name: 'item_id' })
  item?: UsersItemEntity;

  @ManyToOne(() => UserEntity, user => user.itemApprovals)
  @JoinColumn({ name: 'approved_by' })
  approvedBy?: UserEntity;

  @Column({ nullable: true })
  borrow_start_date?: Date;

  @Column({ nullable: true })
  borrow_end_date?: Date;
}
