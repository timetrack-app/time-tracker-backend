import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
  updateUser(user: User, attrs: Partial<User>): Promise<User>;
  updateById(id: number, attrs: Partial<User>);
  updateByEmail(email: string, attrs: Partial<User>);
  verifyUserWithEmail(email: string): Promise<User>;
  updateEmail(id: number, newEmail: string): Promise<void>;
}
