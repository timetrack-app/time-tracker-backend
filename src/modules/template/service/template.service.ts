import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { Template } from '../entity/template.entity';
import { ITemplateService } from '../interfaces/ITemplate.service';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { Logger } from '../../../common/services/logger.service';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { GetTemplatesDto } from '../dto/get-templates-dto';

@injectable()
export class TemplateService implements ITemplateService {
  constructor(
    @inject(TYPES.ITemplateRepository)
    private readonly templateRepository: ITemplateRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  async getUsersTemplates(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}>  {
    const templatesAndTotalCount = await this.templateRepository.findAllByUserId(getTemplatesDto);
    return templatesAndTotalCount;
  }

  async createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template> {
    try {
      const template = await this.templateRepository.create(createTemplateDto);
      return template;
    } catch (error) {
      this.logger.error(`Failed to create a new Template. Error: ${error}`);
      throw new InternalServerErrorException('Failed to create a new Template');
    }
  }

  async deleteTemplate(deleteTemplateDto: DeleteTemplateDto): Promise<void> {
    try {
      await this.deleteTemplate(deleteTemplateDto);
    } catch (error) {
      this.logger.error(`Failed to delete a Template. Error: ${error}`);
      throw new InternalServerErrorException('Failed to delete a Template.');
    }
  }
}
