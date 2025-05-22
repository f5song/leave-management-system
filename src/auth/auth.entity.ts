import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'simple-array', default: ['user'] })
  roles: string[];

  @OneToOne(() => User, user => user.account)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;

  @DeleteDateColumn()
  delete_time: Date | null;
}
