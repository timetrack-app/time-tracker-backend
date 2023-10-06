import { inject, injectable } from 'inversify';
import { IListRepository } from '../interface/IList.repository';
import { TYPES } from '../../../core/type.core';
import { List } from '../entity/list.entity';
import { CreateListDto } from '../dto/createList.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { IListService } from '../interface/IList.service';
import { IWorkSessionRepository } from '../../../modules/workSession/interfaces/IWorkSession.repository';
import { ITabRepository } from '../../../modules/tab/interface/ITab.repository';

@injectable()
export class ListService implements IListService {
  constructor(
    @inject(TYPES.IListRepository)
    private readonly listRepository: IListRepository,
    @inject(TYPES.IWorkSessionRepository)
    private readonly workSessionRepository: IWorkSessionRepository,
    @inject(TYPES.ITabRepository)
    private readonly tabRepository: ITabRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  async createList(
    workSessionId: number,
    tabId: number,
    createListDto: CreateListDto,
  ): Promise<List> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession was not found with Id ${workSessionId}`,
      );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab was not found with Id ${tabId}`);
    try {
      return await this.listRepository.create(tab, createListDto);
    } catch (error) {
      this.logger.error(`Failed to update the list. Error: ${error}`);
      throw new InternalServerErrorException('Failed to create a list.');
    }
  }

  async updateList(
    workSessionId: number,
    tabId: number,
    listId: number,
    attrs: Partial<List>,
  ): Promise<List> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession was not found with Id ${workSessionId}`,
      );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab was not found with Id ${tabId}`);

    const list = await this.listRepository.findOneById(listId);
    if (!list)
      throw new NotFoundException(`List was not found with Id ${listId}`);
    const updatedList = Object.assign(list, attrs);
    try {
      return await this.listRepository.update(updatedList);
    } catch (error) {
      this.logger.error(`Failed to update the list. Error: ${error}`);
      throw new InternalServerErrorException('Failed to update a list.');
    }
  }

  async deleteList(
    workSessionId: number,
    tabId: number,
    listId: number,
  ): Promise<void> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab was not found with Id ${tabId}`);

    const list = await this.listRepository.findOneById(listId);
    if (!list)
      throw new NotFoundException(`List was not found with Id ${listId}`);

    try {
      await this.listRepository.delete(listId);
    } catch (error) {
      this.logger.error(`Failed to delete the list. Error: ${error}`);
      throw new InternalServerErrorException('Failed to delete a list.');
    }
  }
}
