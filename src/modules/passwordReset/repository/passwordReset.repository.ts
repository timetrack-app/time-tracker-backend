import { Repository } from 'typeorm';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { IPasswordResetRepository } from '../interface/IPasswordReset.repository';
import { PasswordReset } from '../entity/passwordReset.entity';
import { createToken } from '../../../common/utils/token/token.utils';
import { NotFoundException } from '../../../common/errors/all.exception';
import { User } from 'src/modules/user/entity/user.entity';

@injectable()
export class PasswordResetRepository implements IPasswordResetRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  private async getRepo(): Promise<Repository<PasswordReset>> {
    return await this.database.getRepository(PasswordReset);
  }

  /**
   *
   *
   * @param {string} token
   * @return {Promise<User>}
   * @memberof PasswordResetRepository
   */
  async findUserByToken(token: string): Promise<User> {
    const repo = await this.getRepo();
    const recordWithUser = await repo.findOne({
      where: { token },
      relations: ['user'],
    });

    return recordWithUser.user;
  }

  /**
   *
   *
   * @param {string} token
   * @return {Promise<PasswordReset>}
   * @memberof PasswordResetRepository
   */
  async findLatestOneByToken(token: string): Promise<PasswordReset> {
    const repo = await this.getRepo();

    const record = await repo.findOne({
      where: { token },
      order: { createdAt: 'DESC' },
    });
    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    return record;
  }

  /**
   *
   *
   * @param {string} email
   * @return {Promise<PasswordReset>}  {Promise<PasswordReset>}
   * @memberof PasswordResetRepository
   */
  async create(email: string): Promise<PasswordReset> {
    const repo = await this.getRepo();

    const token = await createToken();

    return await repo.create({ email, token });
  }

  /**
   *
   *
   * @param {string} token
   * @return {Promise<void>}
   * @memberof PasswordResetRepository
   */
  async delete(token: string): Promise<void> {
    const repo = await this.getRepo();

    const res = await repo.delete({ token });
    if (res.affected === 0) {
      throw new NotFoundException('Record not found.');
    }
  }
}