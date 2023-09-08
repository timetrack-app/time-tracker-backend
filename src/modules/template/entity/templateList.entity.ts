import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TemplateTab } from './templateTab.entity';

@Entity('template_lists')
export class TemplateList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'template_tab_id', nullable: false })
  templateTabId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'display_order', nullable: false })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => TemplateTab, (templateTab) => templateTab.lists)
  @JoinColumn({ name: 'template_tab_id' })
  templateTab: TemplateTab;
}
