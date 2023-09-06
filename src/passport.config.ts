import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { TYPES } from './core/type.core';
import { inject } from 'inversify';
import { IUserRepository } from './modules/user/interfaces/IUser.repository';

export class PassportConfig {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {
    // Define your local strategy for user login
    passport.use(
      'local-login',
      new LocalStrategy(
        {
          usernameField: 'email', // The field used for username in the request body
          passwordField: 'password', // The field used for password in the request body
        },
        async (email, password, done) => {
          try {
            // Find the user by email
            const user = await this.userRepository.findOneByEmail(email);
            // If the user doesn't exist or the password is incorrect, return an error
            if (!user || !(await bcrypt.compare(password, user.password))) {
              return done(null, false, {
                message: 'Incorrect email or password',
              });
            }

            // If the user exists and the password is correct, return the user
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );

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
            const user = await this.userRepository.findOneById(jwtPayload.id);

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
}
