import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { Task } from '../entity/task.entity';

import { Repository } from 'typeorm';
import { ITaskRepository } from '../interface/ITask.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { CreateTaskDto } from '../dto/createTask.dto';
import { List } from '../../../modules/list/entity/list.entity';

@injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @inject(TYPES.IDatabaseService)
    private readonly database: IDatabaseService,
  ) {}

  private async getTaskRepo(): Promise<Repository<Task>> {
    return await this.database.getRepository(Task);
  }

  async findOneById(id: number) {
    const repo = await this.getTaskRepo();
    return repo.findOneBy({ id });
  }

  async create(list: List, createTaskDto: CreateTaskDto): Promise<Task> {
    const repo = await this.getTaskRepo();
    const { name, description, displayOrder } = createTaskDto;
    const task = repo.create({
      list,
      name,
      displayOrder,
      description,
    });
    return await repo.save(task);
  }

  async update(updatedTask: Task): Promise<Task> {
    const repo = await this.getTaskRepo();
    return await repo.save(updatedTask);
  }

  async delete(id: number): Promise<void> {
    const repo = await this.getTaskRepo();
    await repo.delete({ id });
  }
}
