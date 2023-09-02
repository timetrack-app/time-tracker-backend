import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WorkSession } from '../../workSession/entity/workSession.entity';
import { UserEmailVerification } from './userEmailVerification.entity';
import { Template } from '../../template/entity/template.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Define the relations

  @OneToMany(() => WorkSession, (workSession) => workSession.user)
  workSessions: WorkSession[];

  @OneToMany(() => Template, (template) => template.user)
  templates: Template[];

  @OneToOne(() => UserEmailVerification)
  @JoinColumn()
  emailVerification: UserEmailVerification;
}
