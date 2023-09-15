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
  NotFoundException,
  ValidationErrorException,
} from '../../../common/errors/all.exception';
import { authConfig } from '../config/config';
import { IUserService } from '../../../modules/user/interfaces/IUser.service';
import { IUserEmailVerificationService } from '../../../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { User } from '../../../modules/user/entity/user.entity';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.IUserService) private userService: IUserService,
    @inject(TYPES.IUserEmailVerificationService)
    private userEmailVerificationService: IUserEmailVerificationService,
    @inject(TYPES.ISendEMailService)
    private sendEmailService: ISendEmailService,
  ) {}

  async registerUser(registerDto: AuthRegisterDto): Promise<void> {
    const { password, email } = registerDto;

    // check if the user with this email exists in the db
    const userInDb = await this.userService.findOneByEmail(email);
    if (userInDb) {
      throw new ConflictException('User with this email already exists.');
    }

    // hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { email, password: hashedPassword };
    console.log('newUser', newUser);
    await this.userService.createUser(newUser);
    // create a token, save the verification
    const verificationToken =
      await this.userEmailVerificationService.createVerificationToken(email);
    console.log('token', verificationToken);

    // send verification email
    await this.sendEmailService.sendVerificationEmail(email, verificationToken);
  }

  async emailVerification(token: string) {
    if (!token) throw new ValidationErrorException('token is not received.');
    console.log('received token', token);
    const user = await this.userService.verifyUserWithToken(token);
    console.log('after verification', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const jwtToken = await this.generateJWT(user);
    return jwtToken;
  }

  generateJWT(user: User) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: authConfig.jwtTokenExpiresIn,
    });
    return token;
  }

  async login(authLoginDto: AuthLoginDto): Promise<string> {
    const { email, password } = authLoginDto;
    const user = await this.userService.findOneByEmail(email);
    console.log('user on login', user);
    if (!user) {
      throw new ValidationErrorException('Email is invalid.');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid, password, user.password);

    if (!isPasswordValid) {
      throw new ValidationErrorException('Password is incorrect.');
    }

    // if user hasn't completed email verification
    if (!user.isVerified) {
      throw new ForbiddenException('Email not verified');
    }

    // Generate new JWT
    const newToken = this.generateJWT(user);
    return newToken;
  }
}
