import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

/**
 *
 *
 * @param {string} password
 * @return {Promise<string>}
 */
export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

// TODO: remove these if not necessary.

const salt = 'random-private-key';

export async function hashPassword(password: string): Promise<string> {
    return await createHash('sha256').update(`${password}.${salt}`).digest('hex');
}

export async function isPasswordMatch(hash: string, password: string): Promise<boolean> {
    return hash === await hashPassword(password);
}