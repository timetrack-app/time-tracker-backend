import { injectable } from 'inversify';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entity/user.entity';
import { IUserService } from 'src/modules/user/interfaces/IUser.service';
import { fakeUsers } from 'test/factory/user.factory';

export const fakeUser: User = fakeUsers[0];
@injectable()
export class FakeUserService implements IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User> {
    return Promise.resolve(fakeUser);
  }
  findOneById(id: number): Promise<User> {
    return Promise.resolve(fakeUser);
  }
  findOneByEmail(email: string): Promise<User> {
    return Promise.resolve(fakeUser);
  }
  updateUser(user: User, attrs: Partial<User>): Promise<User> {
    return Promise.resolve(fakeUser);
  }
  verifyUserWithToken(token: string): Promise<User> {
    return Promise.resolve(fakeUser);
  }
  updateEmailAndSendVerification(id: number, email: string): Promise<void> {
    return Promise.resolve();
  }
  updatePassword(id: number, password: string): Promise<void> {
    return Promise.resolve();
  }
  handlePasswordResetRequest(id: number, email: string): Promise<void> {
    return Promise.resolve();
  }
}
