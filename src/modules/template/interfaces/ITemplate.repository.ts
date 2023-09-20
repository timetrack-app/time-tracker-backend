import { Template } from '../entity/template.entity';

export interface ITemplateRepository {
  findOneById(templateId: number): Promise<Template>;
};
