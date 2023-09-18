import { Template } from '../entity/template.entity';

export interface ITemplateService {
  findOneById(templateId: number): Promise<Template>;
};
