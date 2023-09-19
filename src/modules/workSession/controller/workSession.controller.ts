import { inject } from 'inversify';
import { controller, httpPost, requestBody, requestParam } from 'inversify-express-utils';
import { TYPES } from 'src/core/type.core';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { Request, Response } from 'express';
import { CreateWorkSessionControllerDto } from '../dto/create-work-session-controller-dto';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { DtoValidationMiddleware } from 'src/middlewares/dto-validation.middleware';

@controller('/users')
export class WorkSessionController {
  constructor(
    @inject(TYPES.IWorkSessionService)
    private readonly workSessionService: IWorkSessionService,
  ) {}

  @httpPost('/:userId/work-sessions', DtoValidationMiddleware(CreateWorkSessionControllerDto))
  public async createWorkSession(
    @requestParam('userId') userId: number,
    @requestBody() reqBody: CreateWorkSessionControllerDto,
    _: Request,
    res: Response,
  ) {
    const dto = new CreateWorkSessionServiceDto();
    dto.userId = userId;
    dto.templateId = reqBody.templateId;

    await this.workSessionService.createWorkSession(dto);
  }
}
