import { Request, Response, NextFunction } from 'express';

/**
 * Custom CORS Middleware
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const CorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Set CORS headers here
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://localhost:3000, http://localhost:3001, http://localhost:3002',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Handle preflight requests
  } else {
    next(); // Continue to the next middleware or route handler
  }
};
