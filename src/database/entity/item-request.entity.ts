import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn
  } from 'typeorm';
  import { ItemEntity } from './item.entity';
  import { UserInfoEntity } from './user-info.entity';
  
  @Entity('item_requests')
  export class ItemRequestEntity {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column({ name: 'item_id' })
    itemId: string;
  
    @Column({ name: 'requester_id' })
    requesterId: string;
  
    @Column()
    quantity: number;
  
    @Column({ default: 'pending' })
    status: 'pending' | 'approved' | 'rejected' | 'returned';
  
    @Column({ name: 'approved_by', nullable: true })
    approvedById?: string;
  
    @Column({ type: 'datetime', name: 'approved_at', nullable: true })
    approvedAt?: Date;
  
    @Column({ type: 'datetime', name: 'returned_at', nullable: true })
    returnedAt?: Date;
  
    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'update_time' })
    updateTime?: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'delete_time' })
    deleteTime?: Date;
  
    @ManyToOne(() => ItemEntity, item => item.requests)
    @JoinColumn({ name: 'item_id' })
    item: ItemEntity;
  
    @ManyToOne(() => UserInfoEntity, user => user.itemRequests)
    @JoinColumn({ name: 'requester_id' })
    requester: UserInfoEntity;
  
    @ManyToOne(() => UserInfoEntity, user => user.itemApprovals)
    @JoinColumn({ name: 'approved_by' })
    approver?: UserInfoEntity;
  }
  