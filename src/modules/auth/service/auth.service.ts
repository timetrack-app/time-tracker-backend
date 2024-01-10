import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';

import { TYPES } from '../../../core/type.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ValidationErrorException,
} from '../../../common/errors/all.exception';
import { IUserService } from '../../../modules/user/interfaces/IUser.service';
import { IUserEmailVerificationService } from '../../../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { User } from '../../../modules/user/entity/user.entity';
import { encryptPassword } from '../../../common/utils/password/password.utils';
import { generateJWT } from '../../../common/utils/jwt/jwt.utils';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.IUserEmailVerificationService)
    private userEmailVerificationService: IUserEmailVerificationService,
    @inject(TYPES.ISendEMailService)
    private sendEmailService: ISendEmailService,
  ) {}

  /**
   * Create user and send a registration email
   *
   * @param {AuthRegisterDto} registerDto
   * @return {*}  {Promise<void>}
   * @memberof AuthService
   */
  async registerUser(registerDto: AuthRegisterDto): Promise<void> {
    const { password, email } = registerDto;

    // check if the user with this email exists in the db
    const userInDb = await this.userService.findOneByEmail(email);
    if (userInDb) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await encryptPassword(password);
    const newUser = { email, password: hashedPassword };

    await this.userService.createUser(newUser);

    // create a token
    const verificationToken =
      await this.userEmailVerificationService.createVerificationToken(email);

    // create verification record
    await this.userEmailVerificationService.createVerification(email, verificationToken);

    // send verification email
    await this.sendEmailService.sendVerificationEmail(email, verificationToken);
  }

  async verifyUser(token: string): Promise<User> {
    if (!token) {
      throw new ValidationErrorException('token is not received.');
    }

    const verifiedUser = await this.userService.verifyUserWithToken(token);
    if (!verifiedUser) {
      throw new NotFoundException('User not found');
    }

    return verifiedUser;
  }

  async login(authLoginDto: AuthLoginDto): Promise<AuthenticatedUserDto> {
    const { email, password } = authLoginDto;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new ValidationErrorException('Email is invalid.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ValidationErrorException('Password is incorrect.');
    }

    // if user hasn't completed email verification
    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }

    // Generate new JWT
    const newToken = generateJWT(user);

    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      authToken: newToken,
    };
  }
}
