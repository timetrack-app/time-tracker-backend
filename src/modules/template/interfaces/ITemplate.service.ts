import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { Template } from '../entity/template.entity';

export interface ITemplateService {
  createTemplate(createTemplateDto: CreateTemplateDto): Promise<Template>;
  deleteTemplate(deleteTemplateDto: DeleteTemplateDto): Promise<void>;
};
