import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserInfoEntity } from './user-info.entity';

@Entity('auth')
export class AuthEntity {
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

  @OneToOne(() => UserInfoEntity, user => user.accounts)
  @JoinColumn()
  user: UserInfoEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;

  @DeleteDateColumn()
  delete_time: Date | null;
}
