import { injectable } from 'inversify';
import { AuthLoginDto } from '../../src/modules/auth/dto/auth-login.dto';
import { AuthRegisterDto } from '../../src/modules/auth/dto/auth-register.dto';
import { IAuthService } from '../../src/modules/auth/interfaces/IAuth.service';
import { User } from '../../src/modules/user/entity/user.entity';

@injectable()
export class FakeAuthService implements IAuthService {
  registerUser(authRegisterDto: AuthRegisterDto): Promise<void> {
    return Promise.resolve();
  }
  login(authLoginDto: AuthLoginDto): Promise<string> {
    return Promise.resolve('jwt token');
  }
  emailVerification(token: string): Promise<string> {
    return Promise.resolve('jwt token');
  }
  generateJWT(user: User): string {
    return 'jwt token';
  }
}
