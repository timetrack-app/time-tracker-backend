import { CreateUserDto } from '../dto/create-user-dto';
import { User } from '../entity/user.entity';

export interface IUserService {
  // createUser(createUserDto: CreateUserDto): Promise<User>;
  findOne(id: number): Promise<User | null>;
}
