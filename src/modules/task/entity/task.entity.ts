import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { List } from '../../list/entity/list.entity';
import { WorkSession } from '../../../modules/workSession/entity/workSession.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'list_id', nullable: false })
  listId: number;

  @Column({ nullable: false })
  displayOrder: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'total_time', nullable: true })
  totalTime: number;

  @Column({ nullable: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => List, (list) => list.tasks, { nullable: false })
  @JoinColumn({ name: 'list_id' })
  list: List;

  @OneToOne(() => WorkSession, (workSession) => workSession.activeTask,{nullable: true})
  workSession: WorkSession;
}
