import 'reflect-metadata';
import { User } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { IUserRepository } from '../interfaces/IUser.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserEmailVerificationService } from '../../../modules/userEmailVerification/interface/IUserEmailVerification.service';
import { ISendEmailService } from '../../../modules/sendMail/interface/ISendEmail.service';
import { NotFoundException } from '../../../common/errors/all.exception';
import { fakeUser } from '../../../../test/factory/user.factory';
import { fakeUserEmailVerificationData } from '../../../../test/factory/userEmailVerification.factory';

const notExistingUser = fakeUser();

const existingUser = fakeUser();

const fakeUserEmailVerification = fakeUserEmailVerificationData

const mockUserRepo: IUserRepository = {
  create: jest.fn((createUserDto: CreateUserDto) =>
    Promise.resolve(notExistingUser),
  ),
  findOneById: jest.fn((id: number) => {
    if (id === notExistingUser.id) return Promise.resolve(null);
    return Promise.resolve(existingUser);
  }),
  findOneByEmail: jest.fn((email: string) => {
    if (email === notExistingUser.email) return null;
    return Promise.resolve(existingUser);
  }), // Modify to simulate an existing user
  update: jest.fn((user: User) => Promise.resolve(user)),
};

const mockEmailVerificationService: IUserEmailVerificationService = {
  createVerificationToken: jest.fn((email: string) => Promise.resolve('token')),
  createVerification: jest.fn((email: string, verificationToken: string) => Promise.resolve(fakeUserEmailVerification)),
  findTokenWithEmail: jest.fn((email: string) => Promise.resolve('token')),
  verify: jest.fn((token: string) => Promise.resolve(existingUser.email)),
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

describe('User Service Test', () => {
  let userService: UserService;

  beforeAll(() => {
    userService = new UserService(
      mockUserRepo,
      mockEmailVerificationService,
      mockSendEmailService,
    );
  });

  describe('createUser', () => {
    it('Should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: notExistingUser.email,
        password: notExistingUser.password,
      };

      const createdUser = await userService.createUser(createUserDto);
      expect(createdUser).toEqual(notExistingUser);
    });
  });

  describe('findOneById', () => {
    it('Should return an existing user', async () => {
      const user = await userService.findOneById(existingUser.id);
      expect(user).toEqual(existingUser);
    });

    it('Should return null for a non-existing user', async () => {
      const user = await userService.findOneById(notExistingUser.id);
      expect(user).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('Should return an existing user', async () => {
      const user = await userService.findOneByEmail(existingUser.email);
      expect(user).toEqual(existingUser);
    });

    it('Should return null for a non-existing user', async () => {
      const user = await userService.findOneByEmail(notExistingUser.email);
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('Should update user attributes', async () => {
      const updatedUser = fakeUser();
      const user = await userService.updateUser(existingUser, updatedUser);
      expect(user).toEqual(updatedUser);
    });
  });

  describe('verifyUserWithToken', () => {
    it('Should verify a user with a valid token', async () => {
      const verifiedUser = await userService.verifyUserWithToken('token');
      expect(verifiedUser.isVerified).toEqual(true);
    });
  });

  describe('updateEmailAndSendVerification', () => {
    const newEmail = 'new@example.com';
    it('Should work fine when id is correct', async () => {
      const userId = existingUser.id;
      await expect(
        await userService.updateEmailAndSendVerification(userId, newEmail),
      ).toBeUndefined();
    });

    it('Should throw an error when id is incorrect', async () => {
      const userId = notExistingUser.id;
      await expect(
        userService.updateEmailAndSendVerification(userId, newEmail),
      ).rejects.toThrow(new NotFoundException('User with this id not found.'));
    });
  });

  describe('updatePassword', () => {
    const newPassword = 'newPassword';
    it('Should work fine when id is correct', async () => {
      const userId = existingUser.id;

      await expect(
        await userService.updatePassword(userId, newPassword),
      ).toBeUndefined();
    });

    it('Should throw an error when id is incorrect', async () => {
      const userId = notExistingUser.id;

      await expect(
        userService.updatePassword(userId, newPassword),
      ).rejects.toThrow(new NotFoundException('User with this id not found.'));
    });
  });
});
