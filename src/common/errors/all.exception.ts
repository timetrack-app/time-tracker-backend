import { httpStatusCode } from '../utils/httpStatus.utils';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(description = 'Bad Request', validationErrors?: any) {
    super(
      'BAD REQUEST',
      httpStatusCode.badRequest,
      description,
      validationErrors,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(description = 'Unauthorized') {
    super('UNAUTHORIZED', httpStatusCode.unauthorized, description);
  }
}

export class ForbiddenException extends HttpException {
  constructor(description = 'Forbidden') {
    super('FORBIDDEN', httpStatusCode.forbidden, description);
  }
}

export class ConflictException extends HttpException {
  constructor(description = 'Conflict') {
    super('CONFLICT', httpStatusCode.conflict, description);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(description = 'Internal Server Error') {
    super(
      'INTERNAL SERVER ERROR',
      httpStatusCode.internalServerError,
      description,
    );
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(description = 'Method Not Allowed') {
    super('METHOD NOT ALLOWED', httpStatusCode.methodNotAllowed, description);
  }
}

export class NotFoundException extends HttpException {
  constructor(description = 'Not Found') {
    super('NOT FOUND', httpStatusCode.notFound, description);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(description = 'Request Timeout') {
    super('REQUEST TIMEOUT', httpStatusCode.requestTimeOut, description);
  }
}
