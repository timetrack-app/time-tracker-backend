import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { User } from '../modules/user/entity/user.entity';

/**
 *
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const AuthGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (error, user: User, info) => {
    if (error) {
      // unexpected error
      console.error(error);
      return res.status(500).json({
        errors: [
          {
            message: 'An unexpected error occurred.',
          },
        ]
      });
    }

    if (!user) {
      // auth error
      return res.status(401).json({
        errors: [
          {
            message: info.message || 'Authentication failed.',
          }
        ]
      });
    }

    req.user = user;

    next();
  })(req, res, next);
};
