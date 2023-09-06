import { CreateUserDto } from './../dto/create-user-dto';
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
    const { email, password } = createUserDto;
    const repo = await this.database.getRepository(User);
    const user = repo.create({ email, password });
    return repo.save(user);
  }

  async findOneById(id: number): Promise<User | null> {
    // try {
    const repo = await this.database.getRepository(User);
    const result = await repo.findOneBy({ id });
    return result;
    // } catch (error: any) {
    //   if (error instanceof NotFoundException)
    //     throw new NotFoundException('User not found');
    //   throw new InternalServerErrorException(`${error.message}`);
    // }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    // try {
    const repo = await this.database.getRepository(User);
    console.log(repo);
    console.log(email);

    try {
      const result = await repo.findOne({ where: { email } });
      return result;
    } catch (error: any) {
      // if (error instanceof NotFoundException)
      //   throw new NotFoundException('User not found');
      // throw new InternalServerErrorException(`${error.message}`);
      console.log(error);
    }
  }
}
