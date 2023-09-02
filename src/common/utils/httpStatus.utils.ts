export const httpStatusCode = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  notFound: 404,
  forbidden: 403,
  unauthorized: 401,
  methodNotAllowed: 405,
  requestTimeOut: 408,
  conflict: 409,
  internalServerError: 500,
} as const;

export type HttpStatusCode =
  (typeof httpStatusCode)[keyof typeof httpStatusCode];

export const httpStatusName = {
  ok: 'OK',
  created: 'CREATED',
  accepted: 'ACCEPTED',
  noContent: 'NO CONTENT',
  badRequest: 'BAD REQUEST',
  notFound: 'NOT FOUND',
  forbidden: 'FORBIDDEN',
  unauthorized: 'UNAUTHORIZED',
  methodNotAllowed: 'METHOD NOT ALLOWED',
  requestTimeOut: 'REQUEST TIMEOUT',
  conflict: 'CONFLICT',
  internalServerError: 'INTERNAL SERVER ERROR',
} as const;

export type HttpStatusName =
  (typeof httpStatusName)[keyof typeof httpStatusName];

export type HttpStatusErrorName = (typeof httpStatusName)[keyof Omit<
  typeof httpStatusName,
  'ok' | 'created' | 'accepted'
>];
