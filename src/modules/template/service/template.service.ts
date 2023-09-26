import { inject, injectable } from 'inversify';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { Template } from '../entity/template.entity';
import { ITemplateService } from '../interfaces/ITemplate.service';
import { TYPES } from '../../../core/type.core';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { Logger } from 'winston';
import { InternalServerErrorException } from '../../../common/errors/all.exception';
import { DeleteTemplateDto } from '../dto/delete-template-dto';

@injectable()
export class TemplateService implements ITemplateService {
  constructor(
    @inject(TYPES.ITemplateRepository)
    private readonly templateRepository: ITemplateRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

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
