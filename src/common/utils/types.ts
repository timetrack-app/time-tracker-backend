export const httpStatusCode = {
  ok: 200,
  created: 201,
  Accepted: 202,
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
