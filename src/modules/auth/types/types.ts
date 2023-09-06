import { User } from '../../user/entity/user.entity';

export type UserWithToken = User & {
  token: string;
};
