import QueryString from 'qs';
import { AuthLoginDto, AuthRegisterDto } from '../dto/index.dto';
import { UserWithToken } from '../types/types';

export interface IAuthService {
  // signIn(payload: SignInCredentialsDto): Promise<User>;
  registerUser(authRegisterDto: AuthRegisterDto): Promise<UserWithToken>;
  emailVerification(
    token: string | QueryString.ParsedQs | string[] | QueryString.ParsedQs[],
  ): void;
  login(authLoginDto: AuthLoginDto): Promise<string>;
}
