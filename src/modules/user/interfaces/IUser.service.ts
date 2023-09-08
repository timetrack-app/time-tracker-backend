import { CreateUserDto } from '../dto/create-user-dto';
import { User } from '../entity/user.entity';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
}
