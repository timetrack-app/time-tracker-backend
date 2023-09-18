import { inject, injectable } from 'inversify';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { TYPES } from 'src/core/type.core';
import { IDatabaseService } from 'src/core/interface/IDatabase.service';
import { Template } from '../entity/template.entity';

@injectable()
class TemplateRepository implements ITemplateRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly database: IDatabaseService,
  ) {}

  async findOneById(templateId: number): Promise<Template> {
    const repo = await this.database.getRepository(Template);
    return await repo.findOneBy({ id: templateId });
  }
};
