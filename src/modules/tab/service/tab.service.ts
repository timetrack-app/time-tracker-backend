import { inject, injectable } from 'inversify';
import { ITabRepository } from '../interface/ITab.repository';
import { TYPES } from '../../../core/type.core';
import { Tab } from '../entity/tab.entity';
import { CreateTabDto } from '../dto/CreateTab.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { ITabService } from '../interface/ITab.service';
import { IWorkSessionRepository } from '../../../modules/workSession/interfaces/IWorkSession.repository';

@injectable()
export class TabService implements ITabService {
  constructor(
    @inject(TYPES.ITabRepository)
    private readonly tabRepository: ITabRepository,
    @inject(TYPES.IWorkSessionRepository)
    private readonly workSessionRepository: IWorkSessionRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  async createTab(
    workSessionId: number,
    createTabDto: CreateTabDto,
  ): Promise<Tab> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `workSession with Id ${workSessionId} was not found`,
      );
    try {
      return await this.tabRepository.create(workSession, createTabDto);
    } catch (error) {
      this.logger.error(`Failed to create a new tab. Error: ${error}`);
      throw new InternalServerErrorException('Failed to create a tab.');
    }
  }

  async updateTab(
    workSessionId: number,
    tabId: number,
    attrs: Partial<Tab>,
  ): Promise<Tab> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession with ID ${workSessionId} not found`,
      );
    const existingTab = await this.tabRepository.findOneById(tabId);
    if (!existingTab)
      throw new NotFoundException(`Tab with ID ${tabId} not found`);

    const updatedTab = Object.assign(existingTab, attrs);
    try {
      return await this.tabRepository.update(updatedTab);
    } catch (error) {
      this.logger.error(`Failed to update the tab. Error: ${error}`);
      throw new InternalServerErrorException('Failed to update a tab.');
    }
  }

  async deleteTab(workSessionId: number, tabId: number): Promise<void> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `workSession with Id ${workSessionId} was not found`,
      );
    const existingTab = await this.tabRepository.findOneById(tabId);
    if (!existingTab)
      throw new NotFoundException(`Tab with ID ${tabId} not found`);
    try {
      await this.tabRepository.delete(tabId, workSession);
    } catch (error) {
      this.logger.error(`Failed to delete the tab. Error: ${error}`);
      throw new InternalServerErrorException('Failed to delete a tab.');
    }
  }
}
