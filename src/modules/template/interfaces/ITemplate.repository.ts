import { User } from 'src/modules/user/entity/user.entity';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { GetTemplatesDto } from '../dto/get-templates-dto';
import { Template } from '../entity/template.entity';
import { GetTemplateDto } from '../dto/get-template-dto';

export interface ITemplateRepository {
  findOneByUserId(getTemplateDto: GetTemplateDto): Promise<Template>;
  findOneById(templateId: number): Promise<Template>;
  findAllByUserId(getTemplatesDto: GetTemplatesDto): Promise<{templates: Template[]; total: number; hasMore: boolean}>;
  create(createTemplateDto: CreateTemplateDto): Promise<Template>;
  delete(templateId: number, user: User): Promise<void>;
};
