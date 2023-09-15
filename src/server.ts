import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './core/container.core';
import {
  HttpStatusCode,
  httpStatusCode,
} from './common/utils/httpStatus.utils';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  MethodNotAllowedException,
  RequestTimeoutException,
} from './common/errors/all.exception';
import { TYPES } from './core/type.core';
import { ISendEmailService } from './modules/sendMail/interface/ISendEmail.service';
import { IPassportService } from './modules/Passport/interface/IPassport.service';

const passportService = container.get<IPassportService>(TYPES.IPassportService);
passportService.init();

const sendEmailService = container.get<ISendEmailService>(
  TYPES.ISendEMailService,
);
sendEmailService.init();

export const server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(passport.initialize());
  // protect /users route
  // app.use('/users', passportService.jwtAuthenticate());
  // // protect /work-sessions route
  // app.use('/work-sessions', passportService.jwtAuthenticate());
});

const errorResponse = (
  req: Request,
  res: Response,
  message: string,
  statusCode: HttpStatusCode,
  error?: any,
) => {
  return res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: message,
    error: error || [],
  });
};

server.setErrorConfig((app) => {
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof NotFoundException) {
      return errorResponse(req, res, error.message, httpStatusCode.notFound);
    }

    if (error instanceof BadRequestException) {
      return errorResponse(
        req,
        res,
        error.message,
        httpStatusCode.badRequest,
        error.validationErrors,
      );
    }

    if (error instanceof InternalServerErrorException) {
      return errorResponse(
        req,
        res,
        error.message,
        httpStatusCode.internalServerError,
      );
    }
    if (error instanceof UnauthorizedException) {
      return errorResponse(
        req,
        res,
        error.message,
        httpStatusCode.unauthorized,
      );
    }
    if (error instanceof ConflictException) {
      return errorResponse(req, res, error.message, httpStatusCode.conflict);
    }
    if (error instanceof ForbiddenException) {
      return errorResponse(req, res, error.message, httpStatusCode.forbidden);
    }
    if (error instanceof MethodNotAllowedException) {
      return errorResponse(
        req,
        res,
        error.message,
        httpStatusCode.methodNotAllowed,
      );
    }
    if (error instanceof RequestTimeoutException) {
      return errorResponse(
        req,
        res,
        error.message,
        httpStatusCode.requestTimeOut,
      );
    }
    next(error);
  });
});
