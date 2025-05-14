import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_id: number;

  @Column()
  role_id: number;

  @Column()
  job_title_id: string;

  @Column()
  department_id: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: 0 })
  salary: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  update_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  delete_time: Date;
  username: any;
}
