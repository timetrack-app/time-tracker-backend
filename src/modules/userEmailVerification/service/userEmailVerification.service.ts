import { ParsedQs } from 'qs';
import { inject, injectable } from 'inversify';
import crypto from 'crypto';

import { IUserEmailVerificationService } from '../interface/IUserEmailVerification.service';
import { TYPES } from '../../../core/type.core';
import { IUserEmailVerificationRepository } from '../interface/IUserEmailVerification.repository';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { UserEmailVerification } from '../entity/userEmailVerification.entity';
import { createToken } from '../../../common/utils/token/token.utils';

@injectable()
export class UserEmailVerificationService
  implements IUserEmailVerificationService
{
  constructor(
    @inject(TYPES.IUserEmailVerificationRepository)
    private readonly userEmailVerificationRepository: IUserEmailVerificationRepository,
  ) {}

  async createVerificationToken(email: string) {
    const verificationToken = await createToken();
    const isEmailAlreadyUsedInPast =
      await this.userEmailVerificationRepository.findOneByEmail(email);
    if (isEmailAlreadyUsedInPast) {
      throw new ConflictException(
        "The email address you're trying to use is already in use or has been used in the past. Please choose a different email address.",
      );
    }

    return verificationToken;
  }

  /**
   * Create email verification record
   *
   * @param {string} email
   * @param {string} verificationToken
   * @return {*}  {Promise<UserEmailVerification>}
   * @memberof UserEmailVerificationService
   */
  async createVerification(email: string, verificationToken: string): Promise<UserEmailVerification> {
    const verification = await this.userEmailVerificationRepository.create({
      email,
      verificationToken,
    });

    return verification;
  }

  async findTokenWithEmail(email: string) {
    const verification =
      await this.userEmailVerificationRepository.findOneByEmail(email);
    const { verificationToken } = verification;
    return verificationToken;
  }

  async verify(token: string | ParsedQs | string[] | ParsedQs[]) {
    try {
      const verification =
        await this.userEmailVerificationRepository.findLatestOneByToken(token);
      if (!verification) throw new NotFoundException('Verification failed.');
      const { email } = verification;
      return email;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
