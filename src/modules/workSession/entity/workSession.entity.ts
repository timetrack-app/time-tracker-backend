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
import { Task } from './task.entity';

@Entity('work_sessions')
export class WorkSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'start_at', nullable: false, type: 'timestamp' })
  startAt: Date;

  @Column({ name: 'end_at', nullable: true, type: 'timestamp' })
  endAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => User, (user) => user.workSessions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Tab, (tab) => tab.workSession)
  tabs: Tab[];
}
