import { ParsedQs } from 'qs';
import { CreateEmailVerificationDto } from '../dto/create-email-verification.dto';
import { UserEmailVerification } from '../entity/userEmailVerification.entity';

export interface IUserEmailVerificationRepository {
  create(dto: CreateEmailVerificationDto): Promise<UserEmailVerification>;
  find(
    verificationToken: string | ParsedQs | string[] | ParsedQs[],
  ): Promise<UserEmailVerification>;
}
