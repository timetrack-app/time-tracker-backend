import { CreateUserDto } from '../dto/create-user.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { User } from '../entity/user.entity';
import { IUserRepository } from '../interfaces/IUser.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const repo = await this.database.getRepository(User);
    const user = repo.create(createUserDto);
    return repo.save(user);
  }

  async findOneById(id: number): Promise<User | null> {
    const repo = await this.database.getRepository(User);
    const result = await repo.findOneBy({ id });
    return result;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const repo = await this.database.getRepository(User);

    const result = await repo.findOne({ where: { email } });
    return result;
  }

  // receive already updated user data, and save it
  async update(user: User): Promise<User> {
    const repo = await this.database.getRepository(User);
    return repo.save(user);
  }
}
