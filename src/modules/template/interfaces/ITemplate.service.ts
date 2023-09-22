import { CreateTemplateDto } from '../dto/create-template-dto';
import { Template } from '../entity/template.entity';

export interface ITemplateService {
  // TODO: create template
  createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template>;
  // TODO: delete template
};
