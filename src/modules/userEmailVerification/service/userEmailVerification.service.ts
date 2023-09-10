import { ParsedQs } from 'qs';
import { inject, injectable } from 'inversify';
import crypto from 'crypto';

import { IUserEmailVerificationService } from '../interface/IUserEmailVerification.service';
import { TYPES } from '../../../core/type.core';
import { IUserEmailVerificationRepository } from '../interface/IUserEmailVerification.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from 'src/common/errors/all.exception';
import { IUserService } from 'src/modules/user/interfaces/IUser.service';

@injectable()
export class UserEmailVerificationService
  implements IUserEmailVerificationService
{
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userEmailVerificationRepository: IUserEmailVerificationRepository,
    private readonly userService: IUserService,
  ) {}

  async createVerificationToken(email: string) {
    const verificationToken = await crypto.randomBytes(32).toString('hex');
    try {
      await this.userEmailVerificationRepository.create({
        email,
        verificationToken,
      });
      return verificationToken;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyUser(token: string | ParsedQs | string[] | ParsedQs[]) {
    try {
      const verification = await this.userEmailVerificationRepository.find(
        token,
      );
      if (!verification) throw new NotFoundException('Verification failed.');
      const { email } = verification;
      return await this.userService.verifyUserWithEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
