import { inject, injectable } from 'inversify';
import { ITaskRepository } from '../interface/ITask.repository';
import { TYPES } from '../../../core/type.core';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/createTask.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { ITaskService } from '../interface/ITask.service';
import { IWorkSessionRepository } from '../../workSession/interfaces/IWorkSession.repository';
import { ITabRepository } from '../../tab/interface/ITab.repository';
import { IListRepository } from '../../../modules/list/interface/IList.repository';

@injectable()
export class TaskService implements ITaskService {
  constructor(
    @inject(TYPES.ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    @inject(TYPES.IWorkSessionRepository)
    private readonly workSessionRepository: IWorkSessionRepository,
    @inject(TYPES.ITabRepository)
    private readonly tabRepository: ITabRepository,
    @inject(TYPES.IListRepository)
    private readonly listRepository: IListRepository,
    @inject(TYPES.Logger)
    private readonly logger: Logger,
  ) {}

  async createTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession with Id ${workSessionId} not found`,
      );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab with Id ${tabId} not found`);

    const list = await this.listRepository.findOneById(listId);
    if (!list) throw new NotFoundException(`List with Id ${listId} not found`);
    try {
      return await this.taskRepository.create(list, createTaskDto);
    } catch (error) {
      this.logger.error(`Failed to update the task. Error: ${error}`);
      throw new InternalServerErrorException('Failed to create a task.');
    }
  }

  async updateTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
    attrs: Partial<Task>,
  ): Promise<Task> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession with Id ${workSessionId} not found`,
      );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab with Id ${tabId} not found`);
    const list = await this.listRepository.findOneById(listId);
    if (!list) throw new NotFoundException(`List with Id ${listId} not found`);
    const task = await this.taskRepository.findOneById(taskId);
    if (!task) throw new NotFoundException(`Task with Id ${taskId} not found`);

    const updatedTask = Object.assign(task, attrs);
    try {
      return await this.taskRepository.update(updatedTask);
    } catch (error) {
      this.logger.error(`Failed to update the task. Error: ${error}`);
      throw new InternalServerErrorException('Failed to update a task.');
    }
  }

  async deleteTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
  ): Promise<void> {
    const workSession = await this.workSessionRepository.findOneById(
      workSessionId,
    );
    if (!workSession)
      throw new NotFoundException(
        `WorkSession with Id ${workSessionId} not found`,
      );
    const tab = await this.tabRepository.findOneById(tabId);
    if (!tab) throw new NotFoundException(`Tab with Id ${tabId} not found`);
    const list = await this.listRepository.findOneById(listId);
    if (!list) throw new NotFoundException(`List with Id ${listId} not found`);
    const task = await this.taskRepository.findOneById(taskId);
    if (!task) throw new NotFoundException(`Task with Id ${taskId} not found`);

    try {
      await this.taskRepository.delete(taskId);
    } catch (error) {
      this.logger.error(`Failed to delete the task. Error: ${error}`);
      throw new InternalServerErrorException('Failed to delete a task.');
    }
  }
}
