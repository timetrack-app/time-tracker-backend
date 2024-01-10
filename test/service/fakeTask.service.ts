import { injectable } from 'inversify';
import { CreateTaskDto } from 'src/modules/task/dto/createTask.dto';
import { Task } from '../../src/modules/task/entity/task.entity';
import { ITaskService } from '../../src/modules/task/interface/ITask.service';
import { fakeTask } from '../factory/task.factory';

@injectable()
export class FakeTaskService implements ITaskService {
  createTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return Promise.resolve({
      ...fakeTask(),
      name: createTaskDto.name,
      displayOrder: createTaskDto.displayOrder,
      description: createTaskDto.description,
    });
  }
  updateTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
    attrs: Partial<Task>,
  ): Promise<Task> {
    return Promise.resolve({ ...fakeTask(), id: taskId, ...attrs });
  }
  deleteTask(
    workSessionId: number,
    tabId: number,
    listId: number,
    taskId: number,
  ): Promise<void> {
    return Promise.resolve();
  }
}
