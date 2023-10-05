import { injectable } from 'inversify';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/entity/user.entity';
import { IUserService } from 'src/modules/user/interfaces/IUser.service';
import { fakeUser } from '../factory/user.factory';

export const user: User = fakeUser();
@injectable()
export class FakeUserService implements IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User> {
    return Promise.resolve(user);
  }
  findOneById(id: number): Promise<User> {
    return Promise.resolve(user);
  }
  findOneByEmail(email: string): Promise<User> {
    return Promise.resolve(user);
  }
  updateUser(user: User, attrs: Partial<User>): Promise<User> {
    return Promise.resolve(user);
  }
  verifyUserWithToken(token: string): Promise<User> {
    return Promise.resolve(user);
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
