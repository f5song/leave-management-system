import {
  Entity, Column, OneToMany, CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ItemRequestEntity } from './users-items-request.entity';
import { ItemCategoryId } from '../../constants/item-category.enum';
import { UserInfoEntity } from './users.entity';
import { ItemStatus } from '../../constants/item-status.enum';
import { UnitType } from '../../constants/item-unit.enum';

@Entity('items')
export class ItemEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ItemCategoryId })
  categoryId: ItemCategoryId;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'enum', enum: UnitType, default: UnitType.PIECE })
  unit: UnitType;

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.AVAILABLE })
  status: ItemStatus;

  @OneToMany(() => ItemRequestEntity, request => request.item)
  requests: ItemRequestEntity[];

  @ManyToOne(() => UserInfoEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserInfoEntity;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'update_time' })
  updateTime?: Date;

  @Column({ type: 'datetime', nullable: true, name: 'delete_time' })
  deleteTime?: Date;
}
