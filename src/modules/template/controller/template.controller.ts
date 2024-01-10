import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, queryParam, requestBody, requestParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { ITemplateService } from '../interfaces/ITemplate.service';
import { Request, Response } from 'express';
import { CreateTemplateRequestDto } from '../dto/create-template-request-dto';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';
import { GetTemplatesDto } from '../dto/get-templates-dto';
import { GetTemplateDto } from '../dto/get-template-dto';

@controller('/users/:userId/templates', AuthGuardMiddleware)
export class TemplateController {
  constructor(
    @inject(TYPES.ITemplateService)
    private readonly templateService: ITemplateService,
  ) {}

  @httpGet('/')
  public async getTemplates(
    @queryParam('page') page: number|undefined,
    @queryParam('limit') limit: number|undefined,
    @requestParam('userId') userId: number,
    req: Request,
    res: Response,
  ) {
    const dto = new GetTemplatesDto();
    dto.userId = req.user.id;
    dto.page = Number(page) || undefined;
    dto.limit = Number(limit) || undefined;

    const { templates, total, hasMore } = await this.templateService.getUserTemplates(dto);
    return res.status(200).json({ templates, total, hasMore });
  }

  @httpGet('/:templateId')
  public async getTemplate(
    @requestParam('templateId') templateId: number,
    req: Request,
    res: Response,
  ) {
    const dto = new GetTemplateDto();
    dto.userId = req.user.id;
    dto.templateId = templateId;

    const template = await this.templateService.getUserTemplate(dto);

    // TODO: the whole app, user info should be taken from the request, not route param
    return res.status(200).json(template);
  }

  @httpPost('/', DtoValidationMiddleware(CreateTemplateRequestDto))
  public async createTemplate(
    @requestParam('userId') userId: number,
    @requestBody() reqBody: CreateTemplateRequestDto,
    req: Request,
    res: Response,
  ) {
    const dto = new CreateTemplateDto();
    dto.userId = req.user.id;
    dto.name = reqBody.name;
    dto.tabs = reqBody.tabs;

    const template = await this.templateService.createTemplate(dto);
    return res.status(201).json(template);
  }

  @httpDelete('/:templateId')
  public async deleteTemplate(
    @requestParam('userId') userId: number,
    @requestParam('templateId') templateId: number,
    req: Request,
    res: Response,
  ) {
    const dto = new DeleteTemplateDto()
    dto.userId = req.user.id;
    dto.templateId = templateId;

    await this.templateService.deleteTemplate(dto);

    return res.status(204).json({});
  }
}
