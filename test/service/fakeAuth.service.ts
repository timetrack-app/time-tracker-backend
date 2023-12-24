import { injectable } from 'inversify';
import { fakeUser } from '../../test/factory/user.factory';
import { AuthLoginDto } from '../../src/modules/auth/dto/auth-login.dto';
import { AuthRegisterDto } from '../../src/modules/auth/dto/auth-register.dto';
import { IAuthService } from '../../src/modules/auth/interfaces/IAuth.service';
import { User } from '../../src/modules/user/entity/user.entity';
import { AuthenticatedUserDto } from '../../src/modules/auth/dto/authenticated-user.dto';

export const user: User = fakeUser();

@injectable()
export class FakeAuthService implements IAuthService {
  registerUser(authRegisterDto: AuthRegisterDto): Promise<void> {
    return Promise.resolve();
  }
  login(authLoginDto: AuthLoginDto): Promise<AuthenticatedUserDto> {
    const dto: AuthenticatedUserDto = new AuthenticatedUserDto();
    dto.id = 1;
    dto.authToken = 'jwt token';
    dto.email = 'example@example.com';
    dto.isVerified = true;

    return Promise.resolve(dto);
  }
  verifyUser(token: string): Promise<User> {
    return Promise.resolve(user);
  }
  generateJWT(user: User): string {
    return 'jwt token';
  }
}
