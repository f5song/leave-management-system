import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { DepartmentId } from '../../constants/department.enum';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryColumn({ type: 'enum', enum: DepartmentId })
  id: DepartmentId;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

}
