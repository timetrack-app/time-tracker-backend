import bcrypt from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IUserRepository } from '../interfaces/IUser.repository';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';
import { CreateUserDto } from '../dto/create-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  ValidationErrorException,
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
    const user = await this.userRepository.findOneById(id);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    return user;
  }

  async updateUser(user: User, attrs: Partial<User>) {
    try {
      Object.assign(user, attrs);
      const updatedUser = this.userRepository.update(user);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('error on updating user');
    }
  }

  async verifyUserWithToken(token: string): Promise<User> {
    const email = await this.userEmailVerificationService.verify(token);
    const user = await this.findOneByEmail(email);
    const verifiedUser = await this.updateUser(user, { isVerified: true });
    return verifiedUser;
  }

  async updateEmailAndSendVerification(id: number, email: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User with this id not found.');
    await this.updateUser(user, {
      email,
      isVerified: false,
    });
    // generate a email verification token
    const token =
      await this.userEmailVerificationService.createVerificationToken(email);
    // using the token, send verification email to the user
    await this.sendEmailService.sendNewEmailConfirmationEmail(email, token);
    //update user's email and set user verification status
  }

  async updatePassword(id: number, password: string) {
    const user = await this.findOneById(id);
    if (!user) throw new NotFoundException('User with this id not found.');
    //update user's email and set user verification status
    // hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.updateUser(user, {
      password: hashedPassword,
    });
    const { email } = user;
    // generate a email verification token
    const token = await this.userEmailVerificationService.findTokenWithEmail(
      email,
    );
    // using the token, send verification email to the user
    await this.sendEmailService.sendNewPasswordConfirmationEmail(email, token);
  }

  async handlePasswordResetRequest(id: number, email: string) {
    if (!(await this.findOneById(id)))
      throw new NotFoundException('User with this id not found.');
    const user = await this.findOneByEmail(email);
    if (!user) throw new ValidationErrorException('This email is invalid');
    this.sendEmailService.sendPasswordResetLinkEmail(id, email);
  }
}
