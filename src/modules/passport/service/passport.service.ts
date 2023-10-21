import passport from 'passport';
import { inject, injectable } from 'inversify';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions, VerifyCallback } from 'passport-jwt';
import { TYPES } from '../../../core/type.core';
import { IUserService } from '../../user/interfaces/IUser.service';
import { IPassportService } from '../interface/IPassport.service';
import { getJwtSecret } from '../../../common/utils/env.utils';

@injectable()
export class PassportService implements IPassportService {
  constructor(@inject(TYPES.IUserService) private userService: IUserService) {}

  public init() {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(),
    };

    const verifyCallback: VerifyCallback = async (jwtPayload, done) => {
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
    }

    passport.use(new JwtStrategy(opts, verifyCallback));
  }

  jwtAuthenticate() {
    return passport.authenticate('jwt', { session: false });
  }
}
