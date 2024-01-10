import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { Template } from '../entity/template.entity';
import { ITemplateService } from '../interfaces/ITemplate.service';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { Logger } from '../../../common/services/logger.service';
import { InternalServerErrorException, NotFoundException } from '../../../common/errors/all.exception';
import { GetTemplatesDto } from '../dto/get-templates-dto';
import { IUserService } from '../../../modules/user/interfaces/IUser.service';
import { GetTemplateDto } from '../dto/get-template-dto';

@injectable()
export class TemplateService implements ITemplateService {
  constructor(
    @inject(TYPES.IUserService)
    private readonly userService: IUserService,
    @inject(TYPES.ITemplateRepository)
    private readonly templateRepository: ITemplateRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  async getUserTemplate(getTemplateDto: GetTemplateDto): Promise<Template> {
    try {
      const res = await this.templateRepository.findOneByUserId(getTemplateDto);
      return res;
    } catch (error) {
      this.logger.error(`Failed to find the user's template. Error: ${error}`);
      throw new NotFoundException("Failed to find the user's template");
    }
  }

  async getUserTemplates(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}>  {
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
      const user = await this.userService.findOneById(deleteTemplateDto.userId);
      await this.templateRepository.delete(deleteTemplateDto.templateId, user);
    } catch (error) {
      this.logger.error(`Failed to delete a Template. Error: ${error}`);
      throw new InternalServerErrorException('Failed to delete a Template.');
    }
  }
}
