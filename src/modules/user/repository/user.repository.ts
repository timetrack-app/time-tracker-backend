import { CreateUserDto } from '../dto/create-user.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { User } from '../entity/user.entity';
import { IUserRepository } from '../interfaces/IUser.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { Repository, UpdateResult } from 'typeorm';
import { encryptPassword } from '../../../common/utils/password.utils';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  private async getRepo(): Promise<Repository<User>> {
    return await this.database.getRepository(User);
  }

  async create(createUserDto: CreateUserDto) {
    const repo = await this.getRepo();
    const user = repo.create(createUserDto);
    return repo.save(user);
  }

  async findOneById(id: number): Promise<User | null> {
    const repo = await this.getRepo();
    const result = await repo.findOneBy({ id });
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const repo = await this.getRepo();
    const result = await repo.findOne({ where: { email } });
    return result;
  }

  // receive already updated user data, and save it
  async update(user: User): Promise<User> {
    const repo = await this.getRepo();
    return repo.save(user);
  }

  async updatePassword(email: string, password: string): Promise<User> {
    const repo = await this.getRepo();
    const hashedPassword = await encryptPassword(password);

    const updateResult: UpdateResult = await repo
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where('email = :email', { email })
      .returning('*')
      .updateEntity(true)
      .execute();

    if (updateResult.affected && updateResult.affected > 0) {
      return updateResult.raw[0] as User;
    }
  }
}
