import { ParsedQs } from 'qs';
import { UserEmailVerification } from '../entity/userEmailVerification.entity';

export interface IUserEmailVerificationService {
  createVerificationToken(email: string): Promise<string>;
  createVerification(email: string, verificationToken: string): Promise<UserEmailVerification>;
  findTokenWithEmail(email: string): Promise<string>;
  verify(token: string | ParsedQs | string[] | ParsedQs[]): Promise<string>;
}
