import { inject, injectable } from 'inversify';
import { IPasswordResetService } from '../interface/IPasswordReset.service';
import { TYPES } from '../../../core/type.core';
import { IPasswordResetRepository } from '../interface/IPasswordReset.repository';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { IUserRepository } from '../../../modules/user/interfaces/IUser.repository';

@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject(TYPES.IPasswordResetRepository)
    private readonly passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.ISendEMailService)
    private readonly sendEmailService: ISendEmailService,
  ) {}

  /**
   * Send password reset email
   *
   * @param {string} email
   * @return {Promise<void>}
   * @memberof PasswordResetService
   */
  async requestPasswordReset(email: string): Promise<void> {
    const record = await this.passwordResetRepository.create(email);

    this.sendEmailService.sendPasswordResetLinkEmail(email, record.token);
  }

  /**
   *
   *
   * @param {string} email
   * @param {string} token
   * @return {Promise<void>}
   * @memberof PasswordResetService
   */
  async verifyToken(email: string, token: string): Promise<void> {
    const record = await this.passwordResetRepository.findLatestOne(email, token);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const isTokenUnexpired = record.createdAt >= oneHourAgo && record.createdAt <= now;
    if (!isTokenUnexpired) {
      throw new InternalServerErrorException('The token is expired');
    }
  }

  async updatePassword(email: string, password: string): Promise<void> {
    // TODO: find user by email -> update
    // TODO: update password
    // TODO: delete token record

    // TODO: transaction
  }
}