import { createToken, isTokenUnexpired, tokenLifetimeMilliSec } from './token.utils';

describe('token.util Test', () => {

  describe('createToken()', () => {
    it('should return a token of the correct length', async () => {
      const token = await createToken();
      expect(token).toHaveLength(64); // 32 bytes in hex format will be 64 characters
    });

    it('should generate different tokens for consecutive calls', async () => {
      const token1 = await createToken();
      const token2 = await createToken();
      expect(token1).not.toEqual(token2);
    });
  });

  describe('isTokenUnexpired()', () => {
    it('should return true for a recently created token using default lifetime', () => {
      const recentDate = new Date();
      expect(isTokenUnexpired(recentDate)).toBe(true);
    });

    it('should return false for an old token using default lifetime', () => {
      const oldDate = new Date(Date.now() - tokenLifetimeMilliSec - 1000); // 1 second older than the default lifetime
      expect(isTokenUnexpired(oldDate)).toBe(false);
    });

    it('should return true for a token within custom lifetime', () => {
      const customLifeTime = 5000; // 5 seconds
      const recentDate = new Date(Date.now() - 3000); // 3 seconds ago
      expect(isTokenUnexpired(recentDate, customLifeTime)).toBe(true);
    });

    it('should return false for a token outside of custom lifetime', () => {
      const customLifeTime = 5000; // 5 seconds
      const oldDate = new Date(Date.now() - 6000); // 6 seconds ago
      expect(isTokenUnexpired(oldDate, customLifeTime)).toBe(false);
    });
  });
});
