import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { GetTemplatesDto } from '../dto/get-templates-dto';
import { Template } from '../entity/template.entity';

export interface ITemplateService {
  getUsersTemplates(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}> ;
  createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template>;
  deleteTemplate(deleteTemplateDto: DeleteTemplateDto): Promise<void>;
};
