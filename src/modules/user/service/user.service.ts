import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../interfaces/IUser.repository';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOneById(id);
  }

  // async createUser(userDto: CreateUserDto) {
  //   const user = await this.userRepository.create(userDto);
  //   return user;
  // }
}
