import {
  Entity, Column, CreateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { ItemCategoryId } from '../../constants/item-category.enum';
import { UserEntity } from './users.entity';
import { ItemStatus } from '../../constants/item-status.enum';
import { UnitType } from '../../constants/item-unit.enum';
import { ItemRequestEntity } from './users-items-requests.entity';

@Entity('users_items')
export class UsersItemEntity {

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

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => ItemRequestEntity, (itemRequest) => itemRequest.item)
  itemRequests: ItemRequestEntity[];

}
