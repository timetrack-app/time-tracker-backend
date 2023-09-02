import { HttpStatusCode, HttpStatusErrorName } from '../utils/httpStatus.utils';

export class HttpException extends Error {
  public readonly name: HttpStatusErrorName;
  public readonly httpCode: HttpStatusCode;
  public readonly validationErrors?: any;

  constructor(
    name: HttpStatusErrorName,
    httpCode: HttpStatusCode,
    description: string,
    validationErrors?: any,
  ) {
    super(description);
    this.name = name;
    this.httpCode = httpCode;
    this.validationErrors = validationErrors;

    Error.captureStackTrace(this, HttpException);
  }
}
