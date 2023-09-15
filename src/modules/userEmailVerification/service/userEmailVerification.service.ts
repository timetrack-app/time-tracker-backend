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

@injectable()
export class UserEmailVerificationService
  implements IUserEmailVerificationService
{
  constructor(
    @inject(TYPES.IUserEmailVerificationRepository)
    private readonly userEmailVerificationRepository: IUserEmailVerificationRepository,
  ) {}

  async createVerificationToken(email: string) {
    const verificationToken = await crypto.randomBytes(32).toString('hex');
    const isEmailAlreadyUsedInPast =
      await this.userEmailVerificationRepository.findOneByEmail(email);
    if (isEmailAlreadyUsedInPast) {
      throw new ConflictException(
        "The email address you're trying to use is already in use or has been used in the past. Please choose a different email address.",
      );
    }
    const verification = await this.userEmailVerificationRepository.create({
      email,
      verificationToken,
    });
    console.log(verification);
    return verificationToken;
  }

  async findTokenWithEmail(email: string) {
    const verification =
      await this.userEmailVerificationRepository.findOneByEmail(email);
    const { verificationToken } = verification;
    return verificationToken;
  }

  async verify(token: string | ParsedQs | string[] | ParsedQs[]) {
    try {
      console.log('verifi service token', token);
      const verification =
        await this.userEmailVerificationRepository.findOneByToken(token);
      console.log('verification instance', verification);

      if (!verification) throw new NotFoundException('Verification failed.');
      const { email } = verification;
      return email;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
