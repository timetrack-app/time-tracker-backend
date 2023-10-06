import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { List } from '../entity/list.entity';

import { Repository } from 'typeorm';
import { IListRepository } from '../interface/IList.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { CreateListDto } from '../dto/createList.dto';
import { Tab } from '../../../modules/tab/entity/tab.entity';

@injectable()
export class ListRepository implements IListRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly database: IDatabaseService,
  ) {}

  private async getListRepo(): Promise<Repository<List>> {
    return await this.database.getRepository(List);
  }

  async findOneById(id: number) {
    const repo = await this.getListRepo();
    return repo.findOneBy({ id });
  }

  async create(tab: Tab, createListDto: CreateListDto): Promise<List> {
    const repo = await this.getListRepo();
    const { name, displayOrder } = createListDto;
    const list = repo.create({
      tab,
      name,
      displayOrder,
    });
    return await repo.save(list);
  }

  async update(updatedList: List): Promise<List> {
    const repo = await this.getListRepo();
    return await repo.save(updatedList);
  }

  async delete(id: number): Promise<void> {
    const repo = await this.getListRepo();
    await repo.delete({ id });
  }
}
