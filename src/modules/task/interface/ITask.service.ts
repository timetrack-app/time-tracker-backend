import { CreateTaskDto } from '../dto/createTask.dto';
import { Task } from '../entity/task.entity';

export interface ITaskService {
  createTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task>;
  updateTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
    attrs: Partial<Task>,
  ): Promise<Task>;
  deleteTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
  ): Promise<void>;
}
