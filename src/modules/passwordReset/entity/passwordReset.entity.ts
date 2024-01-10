import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../modules/user/entity/user.entity';

@Entity('password_reset')
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // relation: users table
  @ManyToOne(() => User, user => user.email)
  user: User;
}
