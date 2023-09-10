import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../interfaces/IUser.repository';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';
import { CreateUserDto } from '../dto/create-user.dto';
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

  async updateUser(user: User, attrs: Partial<User>) {
    Object.assign(user, attrs);
    const updatedUser = this.userRepository.update(user);
    return updatedUser;
  }
  catch(error) {
    throw new InternalServerErrorException(error.message);
  }

  async updateById(id: number, attrs: Partial<User>) {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      Object.assign(user, attrs);
      const updatedUser = this.userRepository.update(user);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateByEmail(email: string, attrs: Partial<User>) {
    try {
      const user = await this.findOneByEmail(email);
      if (!user) {
        throw new NotFoundException('user not found');
      }
      Object.assign(user, attrs);
      const updatedUser = this.userRepository.update(user);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async verifyUserWithEmail(email: string): Promise<User> {
    return await this.updateByEmail(email, { isVerified: true });
  }

  async updateEmail(id: number, newEmail: string) {
    try {
      const user = await this.findOneById(id);
      const updatedUser = await this.updateUser(user, { email: newEmail });
      // mailsending
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
