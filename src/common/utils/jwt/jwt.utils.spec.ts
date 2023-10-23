import jwt from 'jsonwebtoken';
import { fakeUser } from '../../../../test/factory/user.factory';
import { generateJWT } from './jwt.utils';
import { InternalServerErrorException } from '../../errors/all.exception';

describe('jwt.util Test', () => {
  describe('generateJWT()', () => {
    const user = fakeUser();

    it('should generate a valid JWT for a given user', () => {
      const token = generateJWT(user);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decodedToken: any = jwt.decode(token);
      expect(decodedToken.userId).toBe(user.id);
    });
  });
});
