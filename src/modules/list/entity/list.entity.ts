import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tab } from '../../tab/entity/tab.entity';
import { Task } from '../../task/entity/task.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tab_id', nullable: false })
  tabId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'display_order', nullable: false })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => Tab, (tab) => tab.lists)
  @JoinColumn({ name: 'tab_id' })
  tab: Tab;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];
}
