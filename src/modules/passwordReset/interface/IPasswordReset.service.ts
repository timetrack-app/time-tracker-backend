import { PasswordReset } from '../entity/passwordReset.entity';

export interface IPasswordResetService {
  requestPasswordReset(email: string): Promise<void>;
  verifyToken(token: string): Promise<PasswordReset>;
  updatePassword(token: string, password: string): Promise<void>;
  deleteTokenRecord(email: string): Promise<void>;
};
