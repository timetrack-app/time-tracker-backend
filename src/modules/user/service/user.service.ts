import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../interfaces/IUser.repository';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';
import { CreateUserDto } from '../dto/create-user-dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from 'src/common/errors/all.exception';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.create(createUserDto);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create a user');
    }
  }

  async findOneById(id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneByEmail(email);
      if (!user) throw new NotFoundException('user not found');
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
