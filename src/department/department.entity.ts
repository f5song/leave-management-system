import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { AccountEntity } from '../account/account.entity';
import { User } from '../auth/user.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AccountEntity, account => account.department)
  accounts: AccountEntity[];

  @OneToMany(() => User, user => user.department)
  users: User[];

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  delete_time: Date | null;
  jobTitles: any;
}
