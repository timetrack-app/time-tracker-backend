/**
 *
 *
 * @return {string}  current environment of the app
 */
export const getCurrentEnvironment = (): string => process.env.APP_ENV || 'development';

/**
 * Check if it's production environment or not
 *
 * @return {*}  {boolean}
 */
export const isInProduction = (): boolean => getCurrentEnvironment() === 'production';

/**
 *
 *
 * @return {number}  port number
 */
export const getAppPort = (): number => Number(process.env.APP_PORT) || 3000;

export const getAppBaseUrl = (): string => process.env.WEB_DOMAIN || `http://localhost:${getAppPort()}`;
