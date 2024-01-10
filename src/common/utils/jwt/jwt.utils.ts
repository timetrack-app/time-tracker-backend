import jwt from 'jsonwebtoken';
import { User } from '../../../modules/user/entity/user.entity';
import { getJwtSecret } from '../env.utils';
import { InternalServerErrorException } from '../../errors/all.exception';

export const jwtConfig = {
  jwtCookieName: 'timeTrackerAuthToken',
  jwtTokenExpiresIn: '24h',
};

/**
 *
 *
 * @param {User} user
 * @return {string} JWT
 */
export const generateJWT = (user: User): string => {
  const jwtSecretKey = getJwtSecret();
  if (!jwtSecretKey) {
    throw new InternalServerErrorException('Failed to generate authentication token.');
  }

  const token = jwt.sign({ userId: user.id }, jwtSecretKey, {
    expiresIn: jwtConfig.jwtTokenExpiresIn,
  });
  return token;
};
