import { Template } from '../entity/template.entity';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { GetTemplateDto } from '../dto/get-template-dto';
import { GetTemplatesDto } from '../dto/get-templates-dto';

export interface ITemplateService {
  getUserTemplate(getTemplateDto: GetTemplateDto): Promise<Template>;
  getUserTemplates(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}>;
  createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template>;
  deleteTemplate(deleteTemplateDto: DeleteTemplateDto): Promise<void>;
};
