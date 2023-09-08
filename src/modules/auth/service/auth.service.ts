import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { ParsedQs } from 'qs';
import bcrypt from 'bcryptjs';

import { TYPES } from '../../../core/type.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { AuthLoginDto, AuthRegisterDto } from '../dto/index.dto';
import { IUserRepository } from '../../user/interfaces/IUser.repository';
import {
  ConflictException,
  InternalServerErrorException,
  ValidationErrorException,
} from '../../../common/errors/all.exception';
import { UserWithToken } from '../types/types';
import { authConfig } from '../config/config';
import { IUserService } from 'src/modules/user/interfaces/IUser.service';

@injectable()
export class AuthService implements IAuthService {
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

  async registerUser(registerDto: AuthRegisterDto): Promise<UserWithToken> {
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
    const user = await this.userService.createUser(newUser);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: authConfig.jwtTokenExpiresIn,
    });

    return { ...user, token };
  }

  emailVerification(token: string | ParsedQs | string[] | ParsedQs[]): void {
    throw new Error('Method not implemented.');
  }

  async login(authLoginDto: AuthLoginDto): Promise<string> {
    const { email, password } = authLoginDto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new ValidationErrorException('Email is invalid.');
    }
    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ValidationErrorException('Password is incorrect.');
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: authConfig.jwtTokenExpiresIn,
    });
    return token;
  }
}
