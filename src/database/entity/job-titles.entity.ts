import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { EJobTitleId } from "@common/constants/jobtitle.enum";
import { DepartmentEntity } from "./departments.entity";
import { UserEntity } from "./users.entity";
import { EDepartmentId } from "@src/common/constants/department.enum";

@Entity('job_titles')
export class JobTitleEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: EJobTitleId;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => DepartmentEntity, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  departmentId: EDepartmentId;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => UserEntity, (user) => user.jobTitle)
  users: UserEntity[];
}
