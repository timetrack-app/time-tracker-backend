import { ParsedQs } from 'qs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_email_verifications')
export class UserEmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  verificationToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  s;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
