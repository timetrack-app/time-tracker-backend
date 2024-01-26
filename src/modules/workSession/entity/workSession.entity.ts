import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Tab } from '../../tab/entity/tab.entity';
import { Task } from '../../task/entity/task.entity';
import { List } from '../../../modules/list/entity/list.entity';

@Entity('work_sessions')
export class WorkSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_at', nullable: false, type: 'timestamp' })
  startAt: Date;

  @Column({ name: 'end_at', nullable: true, type: 'timestamp' })
  endAt: Date;

  @Column({ name: 'isPaused', nullable: false, default: false })
  isPaused: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => User, (user) => user.workSessions, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Tab, (tab) => tab.workSession, { nullable: false })
  tabs: Tab[];

  @OneToOne(() => Task, (task) => task.workSession, { nullable: true })
  @JoinColumn({ name: 'active_task_id' })
  activeTask: Task;

  @OneToOne(() => List, (tab) => tab.workSession, { nullable: true })
  @JoinColumn({ name: 'active_list_id' })
  activeList: List;

  @OneToOne(() => Tab, (tab) => tab.activeWorkSession, { nullable: true })
  @JoinColumn({ name: 'active_tab_id' })
  activeTab: Tab;
}
