import 'reflect-metadata';
import bcrypt from 'bcryptjs';
import { ParsedQs } from 'qs';

import { AuthService } from '../service/auth.service';
import { fakeUser } from '../../../../test/factory/user.factory';
import { User } from '../../../modules/user/entity/user.entity';
import { IUserEmailVerificationService } from '../../../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { IUserService } from '../../../modules/user/interfaces/IUser.service';
import { CreateUserDto } from '../../../modules/user/dto/create-user.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthLoginDto } from '../dto/auth-login.dto';
import {
  ConflictException,
  ForbiddenException,
  ValidationErrorException,
} from '../../../common/errors/all.exception';
import { generateVerificationData } from '../../../../test/factory/userEmailVerification.factory';

describe('Auth Service Test', () => {
  let authService: AuthService;

  // dummy data implementation
  const fakeUserA = fakeUser();
  const fakeUserB = fakeUser();
  const fakeUserC = fakeUser();

  const notExistingUser: AuthRegisterDto = {
    email: fakeUserA.email,
    password: fakeUserA.password,
    passwordConfirmation: fakeUserA.password,
  };
  const existingUser: AuthRegisterDto = {
    email: fakeUserB.email,
    password: fakeUserB.password,
    passwordConfirmation: fakeUserB.password,
  };

  const userToLogin: AuthLoginDto = {
    email: fakeUserB.email,
    password: fakeUserB.password,
  };

  const userEmailInvalid: AuthLoginDto = {
    email: fakeUserA.email,
    password: fakeUserA.password,
  };

  const userPasswordInvalid: AuthLoginDto = {
    email: fakeUserB.email,
    password: fakeUserA.password,
  };

  const userEmailNotVerified: AuthLoginDto = {
    email: fakeUserC.email,
    password: fakeUserB.password,
  };

  const verificationToken = 'verificationToken';

  // mock services
  const mockUserService: IUserService = {
    createUser: jest.fn((createUserDto: CreateUserDto) =>
      Promise.resolve(fakeUserA),
    ),
    findOneById: jest.fn((id: number) => Promise.resolve(fakeUserA)),
    findOneByEmail: jest.fn(async (email: string) => {
      if (email === fakeUserA.email) return Promise.resolve(null);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userToLogin.password, salt);
      const hashedUser: User = {
        ...fakeUserB,
        password: hashedPassword,
        email: userToLogin.email,
      };
      if (email === userEmailNotVerified.email) {
        hashedUser.isVerified = false;
      }
      return Promise.resolve(hashedUser);
    }),
    updateUser: jest.fn((user: User, attrs: Partial<User>) =>
      Promise.resolve(fakeUserA),
    ),
    verifyUserWithToken: jest.fn((token: string) => Promise.resolve(fakeUserA)),
    updateEmailAndSendVerification: jest.fn((id: number, email: string) =>
      Promise.resolve(),
    ),
    updatePassword: jest.fn((id: number, password: string) =>
      Promise.resolve(),
    ),
  };

  const fakeUserEmailVerification = generateVerificationData({ verificationToken: verificationToken })
  const mockEmailVerificationService: IUserEmailVerificationService = {
    createVerificationToken: jest.fn((email: string) =>
      Promise.resolve(verificationToken),
    ),
    createVerification: jest.fn((email: string, verificationToken: string) => Promise.resolve(fakeUserEmailVerification)),
    findTokenWithEmail: jest.fn((email: string) => Promise.resolve('token')),
    verify: jest.fn((token: string | string[] | ParsedQs | ParsedQs[]) =>
      Promise.resolve('token'),
    ),
  };

  const mockSendEmailService: ISendEmailService = {
    init: jest.fn(() => {}),
    sendVerificationEmail: jest.fn(
      (email: string, emailVerificationToken: string) => {},
    ),
    sendNewEmailConfirmationEmail: jest.fn(
      (email: string, emailVerificationToken: string) => {},
    ),
    sendNewPasswordConfirmationEmail: jest.fn(
      (email: string, token: string) => {},
    ),
    sendPasswordResetLinkEmail: jest.fn((email: string, token: string) => {}),
  };

  // test starts from here

  beforeEach(() => {
    authService = new AuthService(
      mockUserService,
      mockEmailVerificationService,
      mockSendEmailService,
    );
  });

  describe('Register User', () => {
    it('Should create a user', async () => {
      const response = await authService.registerUser(notExistingUser);
      expect(response).toBeUndefined();
    });

    it('Should cause ConflictException Error when the email is in use', async () => {
      await expect(authService.registerUser(existingUser)).rejects.toThrow(
        new ConflictException('User with this email already exists.'),
      );
    });

    it('Should call (createUser) jest.fn of user service', async () => {
      const spy = jest.spyOn(mockUserService, 'createUser');
      expect(spy).toHaveBeenCalled();
    });

    it('Should call (createVerificationToken) jest.fn of email verification service', async () => {
      const spy = await jest.spyOn(
        mockEmailVerificationService,
        'createVerificationToken',
      );
      expect(spy).toHaveBeenCalledWith(notExistingUser.email);
    });

    it('Should call (sendVerificationEmail) jest.fn of send email service', async () => {
      const spy = await jest.spyOn(
        mockSendEmailService,
        'sendVerificationEmail',
      );
      expect(spy).toHaveBeenCalledWith(
        notExistingUser.email,
        verificationToken,
      );
    });
  });

  describe('Email Verification', () => {
    it('Should verify email and return JWT token', async () => {
      const response = await authService.verifyUser(verificationToken);
      expect(response).toBeDefined();
    });

    it('Should call (verifyUserWithToken) jest.fn of user service', () => {
      const spy = jest.spyOn(mockUserService, 'verifyUserWithToken');
      expect(spy).toHaveBeenCalledWith(verificationToken);
    });
  });

  describe('Login', () => {
    it('User can sign in', async () => {
      const response = await authService.login(userToLogin);
      expect(response).toBeDefined();
    });

    it('Email Validation', async () => {
      await expect(authService.login(userEmailInvalid)).rejects.toThrow(
        new ValidationErrorException('Email is invalid.'),
      );
    });

    it('Password validation', async () => {
      await expect(authService.login(userPasswordInvalid)).rejects.toThrow(
        new ValidationErrorException('Password is incorrect.'),
      );
    });

    it('Check if user email is verified', async () => {
      await expect(authService.login(userEmailNotVerified)).rejects.toThrow(
        new ForbiddenException('Email not verified'),
      );
    });
  });
});
