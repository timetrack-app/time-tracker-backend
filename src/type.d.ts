import { User } from './modules/user/entity/user.entity';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}