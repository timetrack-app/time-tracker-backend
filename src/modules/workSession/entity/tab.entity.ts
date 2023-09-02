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
import { WorkSession } from './workSession.entity';
import { List } from './list.entity';

@Entity('tabs')
export class Tab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'work_session_id', nullable: false })
  workSessionId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'display_order', nullable: false })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => WorkSession, (workSession) => workSession.tabs)
  @JoinColumn({ name: 'work_session_id' })
  workSession: WorkSession;

  @OneToMany(() => List, (list) => list.tab)
  lists: List[];
}
