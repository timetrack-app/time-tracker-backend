import { inject, injectable } from 'inversify';

import { IUserEmailVerificationRepository } from '../interface/IUserEmailVerification.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { TYPES } from '../../../core/type.core';
import { CreateEmailVerificationDto } from '../dto/create-email-verification.dto';
import { UserEmailVerification } from '../entity/userEmailVerification.entity';

@injectable()
export class UserEmailVerificationRepository
  implements IUserEmailVerificationRepository
{
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  async create(dto: CreateEmailVerificationDto) {
    const { email, verificationToken } = dto;
    const repo = await this.database.getRepository(UserEmailVerification);
    const verification = repo.create({ email, verificationToken });

    return repo.save(verification);
  }

  async findOneByToken(
    verificationToken: string,
  ): Promise<UserEmailVerification> {
    const repo = await this.database.getRepository(UserEmailVerification);
    const result = await repo.findOne({ where: { verificationToken } });
    return result;
  }

  async findOneByEmail(email: string): Promise<UserEmailVerification | null> {
    const repo = await this.database.getRepository(UserEmailVerification);
    const result = await repo.findOne({ where: { email } });
    return result;
  }
}
