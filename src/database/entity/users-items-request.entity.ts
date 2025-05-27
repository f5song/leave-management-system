import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
} from 'typeorm';
import { ItemEntity } from './users-items.entity';
import { UserEntity } from './users.entity';
import { ItemRequestStatus } from 'src/constants/item-request-status.enum';

@Entity('users_item_requests')
export class ItemRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'item_id' })
  itemId: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: ItemRequestStatus,
    default: ItemRequestStatus.PENDING,
  })
  status: ItemRequestStatus;

  // @Column({ type: 'datetime', name: 'action_at', nullable: true })
  // actionAt?: Date;

  @Column({ type: 'datetime', name: 'approved_at', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'datetime', name: 'returned_at', nullable: true })
  returnedAt?: Date;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @ManyToOne(() => ItemEntity, item => item.itemRequests)
  @JoinColumn({ name: 'item_id' })
  item: ItemEntity;

  @ManyToOne(() => UserEntity, user => user.itemRequests)
  @JoinColumn({ name: 'requested_by' })
  requestedBy: UserEntity;

  @ManyToOne(() => UserEntity, user => user.itemApprovals)
  @JoinColumn({ name: 'approved_by' })
  approvedBy?: UserEntity;
}
