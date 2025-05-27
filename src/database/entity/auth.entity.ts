import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true , name: 'user_name'})
  userName: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'simple-array', default: ['user'] })
  roles: string[];

  @Column({name: 'user_id'})
  userId: number;

  @OneToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'update_time'})
  updateTime: Date;

  @DeleteDateColumn({name: 'delete_time'})
  deleteTime: Date | null;
}
