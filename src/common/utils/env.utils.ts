import { InternalServerErrorException } from '../errors/all.exception';

/**
 *
 *
 * @return {string}  current environment of the app
 */
export const getCurrentEnvironment = (): string => process.env.APP_ENV || 'develop';

/**
 * Check if it's production environment or not
 *
 * @return {boolean}
 */
export const isInProduction = (): boolean => getCurrentEnvironment() === 'production';

/**
 *
 *
 * @return {number}  port number
 */
export const getAppPort = (): number => Number(process.env.APP_PORT) || 3000;

/**
 *
 *
 * @return {string}
 */
export const getAppBaseUrl = (): string => process.env.WEB_DOMAIN || `http://localhost:${getAppPort()}`;

/**
 *
 *
 * @return {string}  JWT secret key
 */
export const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET_KEY;

  if (!jwtSecret || jwtSecret.trim() === '') {
    throw new InternalServerErrorException('JWT_SECRET_KEY is not defined or is an empty string.');
  }

  return jwtSecret;
};

/**
 *
 *
 * @return {string}  {SENDER_EMAIL}
 */
export const getAppEmailAddress = (): string => {
  const appEmailAddress = process.env.SENDER_EMAIL;

  if (!appEmailAddress || appEmailAddress.trim() === '') {
    throw new InternalServerErrorException('SENDER_EMAIL is not defined or is an empty string.');
  }

  return appEmailAddress;
};

/**
 *
 *
 * @return {string}
 */
export const getSendGridApiKey = (): string => {
  const sgApiKey = process.env.SENDGRID_API_KEY;

  if (!sgApiKey || sgApiKey.trim() === '') {
    throw new InternalServerErrorException('SENDGRID_API_KEY is not defined or is an empty string.');
  }

  return sgApiKey;
};

export const getSmtpPort = (): number => process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 1025;

export const getLocalSmtpServerName = (): string => process.env.LOCAL_SMTP_SERVER || 'mailhog';

export const getFrontendPort = (): number => Number(process.env.FRONTEND_PORT) || 3000;

export const getFrontendBaseUrl = (): string => process.env.FRONTEND_DOMAIN || `http://localhost:${getFrontendPort()}`;
