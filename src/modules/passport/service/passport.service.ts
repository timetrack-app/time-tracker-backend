import passport from 'passport';
import { inject, injectable } from 'inversify';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { TYPES } from '../../../core/type.core';

import { IUserService } from '../../user/interfaces/IUser.service';
import { IPassportService } from '../interface/IPassport.service';

@injectable()
export class PassportService implements IPassportService {
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

  public init() {
    passport.use(
      'jwt',
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET_KEY,
        },
        async (jwtPayload, done) => {
          try {
            // Find the user by ID from the JWT payload
            const user = await this.userService.findOneById(jwtPayload.id);

            // If the user doesn't exist, return an error
            if (!user) {
              return done(null, false);
            }

            // If the user exists, return the user
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );
  }

  jwtAuthenticate() {
    return passport.authenticate('jwt', { session: false });
  }
}
