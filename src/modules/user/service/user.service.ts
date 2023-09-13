import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../interfaces/IUser.repository';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { IUserEmailVerificationService } from '../../../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.IUserEmailVerificationService)
    private userEmailVerificationService: IUserEmailVerificationService,
    @inject(TYPES.ISendEMailService)
    private readonly sendEmailService: ISendEmailService,
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

  async verifyUserWithToken(token: string): Promise<User> {
    try {
      const email = await this.userEmailVerificationService.verify(token);
      const user = await this.findOneByEmail(email);
      return await this.updateUser(user, { isVerified: true });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateEmail(id: number, email: string) {
    try {
      const user = await this.findOneById(id);
      await this.updateUser(user, {
        email,
        isVerified: false,
      });
      // generate a email verification token
      const token =
        await this.userEmailVerificationService.createVerificationToken(email);
      // using the token, send verification email to the user
      await this.sendEmailService.sendVerificationEmail(email, token);
      //update user's email and set user verification status
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePassword(id: number, password: string) {
    try {
      const user = await this.findOneById(id);
      //update user's email and set user verification status
      await this.updateUser(user, {
        password,
      });
      const { email } = user;
      // generate a email verification token
      const token =
        await this.userEmailVerificationService.createVerificationToken(email);
      // using the token, send verification email to the user
      await this.sendEmailService.sendVerificationEmail(email, token);
      //update user's email and set user verification status
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
