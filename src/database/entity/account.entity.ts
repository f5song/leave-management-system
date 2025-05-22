import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn
} from 'typeorm';
import { UserInfoEntity } from './user-info.entity';


@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id?: number;

  @Column({ unique: true })
  google_id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  approved_by?: number;

  @Column({ type: 'datetime', nullable: true })
  approved_at?: Date;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  update_time?: Date;

  @Column({ type: 'datetime', nullable: true })
  delete_time?: Date;

  @ManyToOne(() => UserInfoEntity, user => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user?: UserInfoEntity;

  @ManyToOne(() => UserInfoEntity, user => user.approvedAccounts)
  @JoinColumn({ name: 'approved_by' })
  approvedBy?: UserInfoEntity;
}