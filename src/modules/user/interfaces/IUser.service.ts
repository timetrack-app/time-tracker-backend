import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
  updateUser(user: User, attrs: Partial<User>): Promise<User>;
  verifyUserWithToken(token: string): Promise<User>;
  updateEmailAndSendVerification(id: number, email: string): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  handlePasswordResetRequest(email: string): Promise<void>;
}
