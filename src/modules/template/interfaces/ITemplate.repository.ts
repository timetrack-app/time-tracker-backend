import { CreateTemplateDto } from '../dto/create-template-dto';
import { DeleteTemplateDto } from '../dto/delete-template-dto';
import { Template } from '../entity/template.entity';

export interface ITemplateRepository {
  findOneById(templateId: number): Promise<Template>;
  findAllByUserId(userId: number): Promise<Template[]>;
  create(createTemplateDto: CreateTemplateDto): Promise<Template>;
  delete(deleteTemplateDto: DeleteTemplateDto): Promise<void>;
};
