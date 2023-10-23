import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { IPasswordResetService } from '../interface/IPasswordReset.service';
import { IPasswordResetRepository } from '../interface/IPasswordReset.repository';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { IUserService } from '../../../modules/user/interfaces/IUser.service';
import { InternalServerErrorException, NotFoundException } from '../../../common/errors/all.exception';
import { encryptPassword } from '../../../common/utils/password/password.utils';
import { isTokenUnexpired } from '../../../common/utils/token/token.utils';
import { Logger } from '../../../common/services/logger.service';
import { PasswordReset } from '../entity/passwordReset.entity';

@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly database: IDatabaseService,
    @inject(TYPES.IPasswordResetRepository)
    private readonly passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES.IUserService)
    private readonly userService: IUserService,
    @inject(TYPES.ISendEMailService)
    private readonly sendEmailService: ISendEmailService,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  /**
   * Send password reset email
   *
   * @param {string} email
   * @return {Promise<void>}
   * @memberof PasswordResetService
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('The email address is invalid.')
    }

    const record = await this.passwordResetRepository.create(email);

    this.sendEmailService.sendPasswordResetLinkEmail(email, record.token);
  }

  /**
   *
   *
   * @param {string} token
   * @return {Promise<PasswordReset>}
   * @memberof PasswordResetService
   */
  async verifyToken(token: string): Promise<PasswordReset> {
    const record = await this.passwordResetRepository.findLatestOneByToken(token);

    if (!isTokenUnexpired(record.createdAt)) {
      throw new InternalServerErrorException('The token is expired');
    }

    return record;
  }

  /**
   * Update password
   * Delete token record
   *
   * @param {string} token
   * @param {string} password
   * @return {Promise<void>}
   * @memberof PasswordResetService
   */
  async updatePassword(token: string, password: string): Promise<void> {
    const entityManager = await this.database.getManager();
    const queryRunner = entityManager.queryRunner;

    await queryRunner.startTransaction();
    try {
      const user = await this.passwordResetRepository.findUserByToken(token);

      const passwordHash = await encryptPassword(password);
      await this.userService.updateUser(user, {
        password: passwordHash,
      });

      await this.deleteTokenRecord(token);

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(`Failed to update the user's password. Error: ${error}`);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed to update the user's password.");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *
   *
   * @param {string} token
   * @return {Promise<void>}
   * @memberof PasswordResetService
   */
  async deleteTokenRecord(token: string): Promise<void> {
    await this.passwordResetRepository.delete(token);
  }
}