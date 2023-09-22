import { inject, injectable } from 'inversify';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { TYPES } from '../../../core/type.core';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { Template } from '../entity/template.entity';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { TemplateTab } from '../entity/templateTab.entity';
import { TemplateList } from '../entity/templateList.entity';

@injectable()
export class TemplateRepository implements ITemplateRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly database: IDatabaseService,
  ) {}

  async findOneById(templateId: number): Promise<Template> {
    const repo = await this.database.getRepository(Template);
    return await repo.findOneBy({ id: templateId });
  }

  /**
   * Create Template from dto
   *
   * @private
   * @param {CreateTemplateDto} createTemplateDto
   * @return {*}  {Promise<Template>}
   * @memberof TemplateRepository
   */
  private async createNewTemplateInstance(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const templateRepo = await this.database.getRepository(Template);
    const templateTabRepo = await this.database.getRepository(TemplateTab);
    const templateListRepo = await this.database.getRepository(TemplateList);

    const template = templateRepo.create({
      userId: createTemplateDto.userId,
      name: createTemplateDto.name,
    });

    if (!createTemplateDto.tabs || !createTemplateDto.tabs.length) {
      return template;
    }

    template.tabs = createTemplateDto.tabs.map((tabData) => {
      const tab = templateTabRepo.create({
        template,
        name: tabData.name,
        displayOrder: tabData.displayOrder,
      });

      if (tabData.lists && tabData.lists.length) {
        tab.lists = tabData.lists.map((listData) => templateListRepo.create({
          templateTab: tab,
          name: listData.name,
        }));
      }

      return tab;
    });

    return template;
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = await this.createNewTemplateInstance(createTemplateDto);

    const queryRunner = (await this.database.getManager()).queryRunner;
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(template);
      await queryRunner.commitTransaction();

      return template;
    } catch (error) {
      throw new Error(error);
    } finally {
      await queryRunner.release();
    }
  }
}
