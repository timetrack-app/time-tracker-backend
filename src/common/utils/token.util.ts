import crypto from 'crypto';

// 1 hour
export const tokenLifetimeMilliSec = 60 * 60 * 1000;

/**
 * Create token
 *
 * @return {Promise<string>}  {token}
 */
export const createToken = async (): Promise<string> => {
  return await crypto.randomBytes(32).toString('hex');
};

/**
 * Check if a token is expired or not
 *
 * @param {Date} tokenCreatedAt
 * @return {boolean} true if token is not expired
 */
export const isTokenUnexpired = (tokenCreatedAt: Date): boolean => {
  const now = new Date();
  const lifeTimeMilliSecAgo = new Date(now.getTime() - tokenLifetimeMilliSec);

  return tokenCreatedAt >= lifeTimeMilliSecAgo && tokenCreatedAt <= now;
};
