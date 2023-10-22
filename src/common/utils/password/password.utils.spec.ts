import bcrypt from 'bcryptjs';
import { encryptPassword } from './password.utils';

describe('password.util Test', () => {
  describe('encryptPassword()', () => {
    it('should return a hashed password', async () => {
      const password = 'samplePassword123';
      const hashedPassword = await encryptPassword(password);

      // check if the hashed password is not the same as the original password
      expect(hashedPassword).not.toEqual(password);

      // verify that the original password matches the hashed password
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBeTruthy();
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'samplePassword123';
      const hashedPassword1 = await encryptPassword(password);
      const hashedPassword2 = await encryptPassword(password);

      // check if the two hashed passwords are different
      expect(hashedPassword1).not.toEqual(hashedPassword2);
    });
  });
});
