import { ParsedQs } from 'qs';
import { User } from 'src/modules/user/entity/user.entity';

export interface IUserEmailVerificationService {
  createVerificationToken(email: string): Promise<string>;
  verifyUser(token: string | ParsedQs | string[] | ParsedQs[]): Promise<User>;
}
