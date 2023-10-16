import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn,  } from 'typeorm';

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
}
