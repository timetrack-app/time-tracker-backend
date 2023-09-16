import { httpStatusCode, httpStatusName } from '../utils/httpStatus.utils';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  constructor(description = 'Bad Request', validationErrors?: any) {
    super(
      httpStatusName.badRequest,
      httpStatusCode.badRequest,
      description,
      validationErrors,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(description = 'Unauthorized') {
    super(
      httpStatusName.unauthorized,
      httpStatusCode.unauthorized,
      description,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(description = 'Forbidden') {
    super(httpStatusName.forbidden, httpStatusCode.forbidden, description);
  }
}

export class ConflictException extends HttpException {
  constructor(description = 'Conflict') {
    super(httpStatusName.conflict, httpStatusCode.conflict, description);
  }
}

export class ValidationErrorException extends HttpException {
  constructor(description = 'Validation Error') {
    super(
      httpStatusName.validationError,
      httpStatusCode.validationError,
      description,
    );
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(description = 'Internal Server Error') {
    super(
      httpStatusName.internalServerError,
      httpStatusCode.internalServerError,
      description,
    );
  }
}

export class MethodNotAllowedException extends HttpException {
  constructor(description = 'Method Not Allowed') {
    super(
      httpStatusName.methodNotAllowed,
      httpStatusCode.methodNotAllowed,
      description,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(description = 'Not Found') {
    super(httpStatusName.notFound, httpStatusCode.notFound, description);
  }
}

export class RequestTimeoutException extends HttpException {
  constructor(description = 'Request Timeout') {
    super(
      httpStatusName.requestTimeOut,
      httpStatusCode.requestTimeOut,
      description,
    );
  }
}
