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
import { Template } from './template.entity';
import { TemplateList } from './templateList';

@Entity('template_tabs')
export class TemplateTab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'template_id', nullable: false })
  templateId: number;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'display_order', nullable: false })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @ManyToOne(() => Template, (template) => template.tabs)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @OneToMany(() => TemplateList, (templateList) => templateList.templateTab)
  lists: TemplateList[];
}
