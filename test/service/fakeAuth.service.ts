import { injectable } from 'inversify';
import { fakeUser } from '../../test/factory/user.factory';
import { AuthLoginDto } from '../../src/modules/auth/dto/auth-login.dto';
import { AuthRegisterDto } from '../../src/modules/auth/dto/auth-register.dto';
import { IAuthService } from '../../src/modules/auth/interfaces/IAuth.service';
import { User } from '../../src/modules/user/entity/user.entity';


export const user: User = fakeUser();
@injectable()
export class FakeAuthService implements IAuthService {
  registerUser(authRegisterDto: AuthRegisterDto): Promise<void> {
    return Promise.resolve();
  }
  login(authLoginDto: AuthLoginDto): Promise<string> {
    return Promise.resolve('jwt token');
  }
  verifyUser(token: string): Promise<User> {
    return Promise.resolve(user);
  }
  generateJWT(user: User): string {
    return 'jwt token';
  }
}
