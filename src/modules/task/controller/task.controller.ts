import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  httpPut,
  httpDelete,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { ITaskService } from './../interface/ITask.service';
import { CreateTaskDto } from '../dto/createTask.dto';
import { Task } from '../entity/task.entity';
import { AuthGuardMiddleware } from '../../../middlewares/auth-guard.middleware';

@controller(
  '/work-sessions/:workSessionId/tabs/:tabId/lists/:listId/tasks',
  AuthGuardMiddleware
)
export class TaskController {
  constructor(
    @inject(TYPES.ITaskService)
    private readonly taskService: ITaskService,
  ) {}

  @httpPost('/')
  public async createTask(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestParam('listId') listId: number,
    @requestBody() reqBody: CreateTaskDto,
    _: Request,
    res: Response,
  ) {
    const newTask = await this.taskService.createTask(
      workSessionId,
      tabId,
      listId,
      reqBody,
    );
    return res.status(200).json(newTask);
  }

  @httpPut('/:taskId')
  public async updateTask(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestParam('listId') listId: number,
    @requestParam('taskId') taskId: number,
    @requestBody() reqBody: Partial<Task>,
    _: Request,
    res: Response,
  ) {
    const updatedTask = await this.taskService.updateTask(
      workSessionId,
      tabId,
      listId,
      taskId,
      reqBody,
    );
    return res.status(200).json(updatedTask);
  }

  @httpDelete('/:taskId')
  public async deleteTask(
    @requestParam('workSessionId') workSessionId: number,
    @requestParam('tabId') tabId: number,
    @requestParam('listId') listId: number,
    @requestParam('taskId') taskId: number,
    _: Request,
    res: Response,
  ) {
    await this.taskService.deleteTask(workSessionId, tabId, listId, taskId);
    return res.status(204).send();
  }
}
