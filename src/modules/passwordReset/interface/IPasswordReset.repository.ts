import { PasswordReset } from '../entity/passwordReset.entity';

export interface IPasswordResetRepository {
  findLatestOne(email: string, token: string): Promise<PasswordReset>;
  create(email: string): Promise<PasswordReset>;
  delete(email: string): Promise<void>;
};
