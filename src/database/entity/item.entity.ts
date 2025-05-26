import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn
  } from 'typeorm';
  import { ItemRequestEntity } from './item-request.entity';
  
  @Entity('items')
  export class ItemEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ nullable: true })
    description?: string;
  
    @Column({ default: 0 })
    quantity: number;
  
    @OneToMany(() => ItemRequestEntity, request => request.item)
    requests: ItemRequestEntity[];
  
    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'update_time' })
    updateTime?: Date;
  
    @Column({ type: 'datetime', nullable: true, name: 'delete_time' })
    deleteTime?: Date;
  }
  