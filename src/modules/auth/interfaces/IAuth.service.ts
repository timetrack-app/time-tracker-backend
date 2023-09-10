import { User } from 'src/modules/user/entity/user.entity';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';

export interface IAuthService {
  // signIn(payload: SignInCredentialsDto): Promise<User>;
  registerUser(authRegisterDto: AuthRegisterDto): Promise<void>;
  login(authLoginDto: AuthLoginDto): Promise<string>;
  generateJWT(user: User): string;
}
