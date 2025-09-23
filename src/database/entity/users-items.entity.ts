import {
  Entity, Column, CreateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  DeleteDateColumn
} from 'typeorm';
import { EItemCategoryId } from '@common/constants/item-category.enum';
import { UserEntity } from './users.entity';
import { EItemStatus } from '@common/constants/item-status.enum';
import { EUnitType } from '@common/constants/item-unit.enum';
import { UsersItemRequestEntity } from './users-items-requests.entity';

@Entity('users_items')
export class UsersItemEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ type: 'enum', enum: EItemStatus, default: EItemStatus.AVAILABLE })
  status?: EItemStatus;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  createdBy: UserEntity;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @OneToMany(() => UsersItemRequestEntity, request => request.item)
  itemRequests: UsersItemRequestEntity[];

}
