import { User } from '../../../modules/user/entity/user.entity';
import { PasswordReset } from '../entity/passwordReset.entity';

export interface IPasswordResetRepository {
  findLatestOneByToken(token: string): Promise<PasswordReset>;
  findUserByToken(token: string): Promise<User>;
  create(email: string): Promise<PasswordReset>;
  delete(token: string): Promise<void>;
};
