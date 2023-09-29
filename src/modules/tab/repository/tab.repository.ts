// Tab.repository.ts

import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { Tab } from '../entity/tab.entity';

import { NotFoundException } from '../../../common/errors/all.exception';
import { Repository } from 'typeorm';
import { ITabRepository } from '../interface/ITab.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { CreateTabDto } from '../dto/CreateTab.dto';
import { WorkSession } from '../../../modules/workSession/entity/workSession.entity';

@injectable()
export class TabRepository implements ITabRepository {
  constructor(
    @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
  ) {}

  private async getTabRepo(): Promise<Repository<Tab>> {
    return await this.database.getRepository(Tab);
  }

  async findOneById(id: number) {
    const repo = await this.getTabRepo();
    return repo.findOneBy({ id });
  }

  async create(
    workSession: WorkSession,
    createTabDto: CreateTabDto,
  ): Promise<Tab> {
    const repo = await this.getTabRepo();
    const { name, displayOrder } = createTabDto;
    const tab = repo.create({
      workSession,
      name,
      displayOrder,
    });
    return await repo.save(tab);
  }

  async update(
    tabId: number,
    workSession: WorkSession,
    attrs: Partial<Tab>,
  ): Promise<Tab> {
    const repo = await this.getTabRepo();
    const existingTab = await repo.findOne({
      where: { id: tabId, workSession },
    });
    if (!existingTab) {
      throw new NotFoundException(
        `Tab with ID ${tabId} not found for WorkSession ${workSession.id}`,
      );
    }
    Object.assign(existingTab, attrs);
    return await repo.save(existingTab);
  }

  async delete(id: number, workSession: WorkSession): Promise<void> {
    const repo = await this.getTabRepo();
    await repo.delete({ id, workSession });
  }
}
