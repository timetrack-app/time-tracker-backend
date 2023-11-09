import { inject, injectable } from 'inversify';
import { ITemplateRepository } from '../interfaces/ITemplate.repository';
import { TYPES } from '../../../core/type.core';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { Template } from '../entity/template.entity';
import { CreateTemplateDto } from '../dto/create-template-dto';
import { TemplateTab } from '../entity/templateTab.entity';
import { TemplateList } from '../entity/templateList.entity';
import { DeleteTemplateDto } from '../dto/delete-template-dto';

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

  async findAllByUserId(userId: number): Promise<Template[]> {
    const repo = await this.database.getRepository(Template);
    const templates = await repo.find({
      where: {
        user: { id: userId },
      },
      relations: ['tabs', 'tabs.lists'],
    });

    return templates;
  }

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const entityManager = await this.database.getManager();
    const queryRunner = entityManager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create and save the template
      const template = queryRunner.manager.create(Template, {
          userId: createTemplateDto.userId,
          name: createTemplateDto.name,
      });
      await queryRunner.manager.save(Template, template);

      // create and save all TemplateTab
      const tabs = createTemplateDto.tabs.map(tabData =>
        queryRunner.manager.create(TemplateTab, {
            template: template,
            name: tabData.name,
            displayOrder: tabData.displayOrder,
        }),
      );
      await queryRunner.manager.save(TemplateTab, tabs);

      // Create and save all TemplateList
      const lists = createTemplateDto.tabs.flatMap((tabData, index) => {
        return tabData.lists.map(listData =>
          queryRunner.manager.create(TemplateList, {
            templateTab: tabs[index],
            name: listData.name,
            displayOrder: listData.displayOrder,
          }),
        );
      });
      await queryRunner.manager.save(TemplateList, lists);

      await queryRunner.commitTransaction();

      return template;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  async delete(deleteTemplateDto: DeleteTemplateDto): Promise<void> {
    const repo = await this.database.getRepository(Template);

    await repo
      .createQueryBuilder()
      .delete()
      .from(Template)
      .where('id = :id', { id: deleteTemplateDto.templateId })
      .andWhere('user_id = :userId', { userId: deleteTemplateDto.userId })
      .execute();
  }
}
