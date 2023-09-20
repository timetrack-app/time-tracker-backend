import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { CreateWorkSessionControllerDto } from '../dto/create-work-session-controller-dto';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { CreateWorkSessionReturnType } from '../types';
import { InternalServerErrorException } from 'src/common/errors/all.exception';

@controller('/users/:userId/work-sessions')
export class WorkSessionController {
  constructor(
    @inject(TYPES.IWorkSessionService)
    private readonly workSessionService: IWorkSessionService,
  ) {}

  @httpPost('/', DtoValidationMiddleware(CreateWorkSessionControllerDto))
  public async createWorkSession(
    @requestParam('userId') userId: number,
    @requestBody() reqBody: CreateWorkSessionControllerDto,
    _: Request,
    res: Response<CreateWorkSessionReturnType>,
  ) {
    const dto = new CreateWorkSessionServiceDto();
    dto.userId = userId;
    dto.templateId = reqBody.templateId;

    try {
      const latestWorkSession = await this.workSessionService.createWorkSession(dto);

      const statusCode = latestWorkSession.isUnfinished ? 200 : 204;

      return res.status(statusCode).json({
        isUnfinished: latestWorkSession.isUnfinished,
        workSession: latestWorkSession.workSession,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create new WorkSession.');
    }
  }
}
