import { Repository } from 'typeorm';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { IPasswordResetRepository } from '../interface/IPasswordReset.repository';
import { PasswordReset } from '../entity/passwordReset.entity';
import { createToken } from '../../../common/utils/token.util';
import { NotFoundException } from '../../../common/errors/all.exception';

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
   * @param {string} email
   * @return {Promise<PasswordReset>}  {Promise<PasswordReset>}
   * @memberof PasswordResetRepository
   */
  async create(email: string): Promise<PasswordReset> {
    const repo = await this.getRepo();

    const token = await createToken();

    return await repo.create({ email, token });
  }

  async findLatestOne(email: string, token: string): Promise<PasswordReset> {
    const repo = await this.getRepo();

    const record = await repo.findOne({
      where: { email, token },
      order: { createdAt: 'DESC' },
    });
    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    return record;
  }

  async delete(email: string): Promise<void> {
    const repo = await this.getRepo();

    const res = await repo.delete({ email });
    if (res.affected === 0) {
      throw new NotFoundException('Record not found.');
    }
  }
}