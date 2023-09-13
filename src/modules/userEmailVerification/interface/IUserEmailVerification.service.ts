import { ParsedQs } from 'qs';
import { User } from '../../../modules/user/entity/user.entity';

export interface IUserEmailVerificationService {
  createVerificationToken(email: string): Promise<string>;
  verify(token: string | ParsedQs | string[] | ParsedQs[]): Promise<string>;
}
