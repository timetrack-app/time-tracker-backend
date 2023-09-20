import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { CreateWorkSessionControllerDto } from '../dto/create-work-session-controller-dto';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { CreateWorkSessionReturnType } from '../types';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { EndWorkSessionDto } from '../dto/end-work-session-dto';

@controller('/users/:userId/work-sessions')
export class WorkSessionController {
  constructor(
    @inject(TYPES.IWorkSessionService)
    private readonly workSessionService: IWorkSessionService,
  ) {}

  @httpGet('/latest')
  public async findLatestUnfinishedWorkSession(
    @requestParam('userId') userId: number,
    _: Request,
    res: Response,
  ) {
    const dto = new FindLatestUnfinishedWorkSessionDto();
    dto.userId = Number(userId);
    const workSession = await this.workSessionService.getLatestUnfinishedWorkSession(dto);

    return res.status(200).json({ workSession });
  }

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

  @httpPut('/:workSessionId/end')
  public async endWorkSession(
    @requestParam('userId') _userId: number,
    @requestParam('workSessionId') workSessionId: number,
    _req: Request,
    res: Response,
  ) {
    const dto = new EndWorkSessionDto();
    dto.workSessionId = workSessionId;
    const workSession = await this.workSessionService.endWorkSession(dto);

    return res.status(200).json({...workSession});
  }
}
