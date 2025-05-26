import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';


@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true , name: 'userId'})
  userId?: string;

  @Column({ unique: true , name: 'googleId'})
  googleId: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true , name: 'approvedBy'})
  approvedById?: string;

  @Column({ type: 'datetime', nullable: true , name: 'approvedAt'})
  approvedAt?: Date;

  @CreateDateColumn({ type: 'datetime' , name: 'createdAt'})
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true , name: 'updatedAt'})
  updateTime?: Date;

  @Column({ type: 'datetime', nullable: true , name: 'deletedAt'})
  deleteTime?: Date;

  @ManyToOne(() => UserInfoEntity, user => user.id)
  @JoinColumn({ name: 'userId' })
  user?: UserInfoEntity;

  @ManyToOne(() => UserInfoEntity, user => user.approvedAccounts)
  @JoinColumn({ name: 'approvedBy' })
  approvedBy?: UserInfoEntity;
}