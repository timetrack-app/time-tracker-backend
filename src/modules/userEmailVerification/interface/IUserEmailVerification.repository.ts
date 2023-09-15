import { ParsedQs } from 'qs';
import { CreateEmailVerificationDto } from '../dto/create-email-verification.dto';
import { UserEmailVerification } from '../entity/userEmailVerification.entity';

export interface IUserEmailVerificationRepository {
  create(dto: CreateEmailVerificationDto): Promise<UserEmailVerification>;
  findOneByToken(
    verificationToken: string | ParsedQs | string[] | ParsedQs[],
  ): Promise<UserEmailVerification>;
  findOneByEmail(email: string): Promise<UserEmailVerification | null>;
}
