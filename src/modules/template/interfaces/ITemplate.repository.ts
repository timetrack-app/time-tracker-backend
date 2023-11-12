import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { GetTemplatesDto } from '../dto/get-templates-dto';
import { Template } from '../entity/template.entity';

export interface ITemplateRepository {
  findOneById(templateId: number): Promise<Template>;
  findAllByUserId(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}>;
  create(createTemplateDto: CreateTemplateDto): Promise<Template>;
  delete(deleteTemplateDto: DeleteTemplateDto): Promise<void>;
};
