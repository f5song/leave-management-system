import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => User, user => user.role)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_time: Date;
}
