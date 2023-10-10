import { List } from '../../../modules/list/entity/list.entity';
import { CreateTaskDto } from '../dto/createTask.dto';
import { Task } from '../entity/task.entity';

export interface ITaskRepository {
  findOneById(id: number): Promise<Task | null>;
  create(list: List, createTaskDto: CreateTaskDto): Promise<Task>;
  update(updatedTask: Task): Promise<Task>;
  delete(taskId: number): Promise<void>;
}
