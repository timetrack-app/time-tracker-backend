import { User } from './../entity/user.entity';
import { CreateUserDto } from '../dto/create-user-dto';

export interface IUserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  findOneById(id: number): Promise<User | null>;
  findOneByEmail(email: string): Promise<User | null>;
}
