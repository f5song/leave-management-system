import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  google_id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  approved_by: number;

  @OneToOne(() => User, user => user.account)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
