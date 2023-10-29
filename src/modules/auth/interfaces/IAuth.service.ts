import { User } from '../../../modules/user/entity/user.entity';
import { AuthLoginDto } from '../dto/auth-login.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';

export interface IAuthService {
  registerUser(authRegisterDto: AuthRegisterDto): Promise<void>;
  login(authLoginDto: AuthLoginDto): Promise<string>;
  verifyUser(token: string): Promise<User>;
}
