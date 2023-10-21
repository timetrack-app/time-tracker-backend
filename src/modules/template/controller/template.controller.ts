import { inject } from 'inversify';
import { controller, httpDelete, httpPost, requestBody, requestParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { ITemplateService } from '../interfaces/ITemplate.service';
import { Request, Response } from 'express';
import { CreateTemplateRequestDto } from '../dto/create-template-request-dto';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';

@controller('/users/:userId/templates', AuthGuardMiddleware)
export class TemplateController {
  constructor(
    @inject(TYPES.ITemplateService)
    private readonly templateService: ITemplateService,
  ) {}

  @httpPost('/', DtoValidationMiddleware(CreateTemplateRequestDto))
  public async createTemplate(
    @requestParam('userId') userId: number,
    @requestBody() reqBody: CreateTemplateRequestDto,
    _: Request,
    res: Response,
  ) {
    const dto = new CreateTemplateDto();
    dto.userId = userId;
    dto.name = reqBody.name;
    dto.tabs = reqBody.tabs;

    const template = await this.templateService.createTemplate(dto);
    return res.status(204).json({ ...template });
  }

  @httpDelete('/:templateId')
  public async DeleteTemplateDto(
    @requestParam('userId') userId: number,
    @requestParam('templateId') templateId: number,
    _: Request,
    res: Response,
  ) {
    const dto = new DeleteTemplateDto()
    dto.userId = userId;
    dto.templateId = templateId;

    await this.templateService.deleteTemplate(dto);

    return res.status(204).json({});
  }
}
