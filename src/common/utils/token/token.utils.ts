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
 * @param {number} [lifeTimeMilliSec=tokenLifetimeMilliSec]
 * @return {boolean} true if unexpired, false if expired
 */
export const isTokenUnexpired = (
  tokenCreatedAt: Date,
  lifeTimeMilliSec = tokenLifetimeMilliSec
): boolean => {
  const now = new Date();
  const lifeTimeMilliSecAgo = new Date(now.getTime() - lifeTimeMilliSec);

  return tokenCreatedAt >= lifeTimeMilliSecAgo && tokenCreatedAt <= now;
};
