import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserInfoEntity } from './users.entity';

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

  @OneToOne(() => UserInfoEntity, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserInfoEntity;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'update_time'})
  updateTime: Date;

  @DeleteDateColumn({name: 'delete_time'})
  deleteTime: Date | null;
}
