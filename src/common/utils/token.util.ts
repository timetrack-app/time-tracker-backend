import crypto from 'crypto';

/**
 * Create token
 *
 * @return {Promise<string>}  {token}
 */
export const createToken = async (): Promise<string> => {
  return await crypto.randomBytes(32).toString('hex');
};
