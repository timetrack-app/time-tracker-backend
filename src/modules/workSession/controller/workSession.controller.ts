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

@controller('/users/:userId/work-sessions')
// @controller('/sessions')
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
    res: Response,
  ) {
    const dto = new CreateWorkSessionServiceDto();
    dto.userId = userId;
    dto.templateId = reqBody.templateId;

    // TODO: if the user has unfinished work session, throw error

    try {
      const workSession = await this.workSessionService.createWorkSession(dto);
      // TODO: Add latest: boolean property to return value
      // TODO: if latest: true then return 200, else 204
      return res.status(204).json(workSession);
    } catch (error) {
      // TODO: error handling
    }
  }
}
