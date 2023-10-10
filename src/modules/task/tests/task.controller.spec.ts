import 'reflect-metadata';
import container from '../../../core/container.core';
import { TYPES } from '../../../core/type.core';
import { agent } from '../../../../test/utils/supertest.utils';
import { CreateTaskDto } from '../dto/createTask.dto';
import { ITaskService } from '../interface/ITask.service';
import { FakeTaskService } from '../../../../test/service/fakeTask.service';
import { Task } from '../entity/task.entity';

const workSessionId = 1;
const tabId = 1;
const listId = 1;
const taskId = 1;
const baseURL = `/work-sessions/${workSessionId}/tabs/${tabId}/lists/${listId}/tasks`;

describe('Task Controller Test', () => {
  beforeAll(() => {
    container.rebind<ITaskService>(TYPES.ITaskService).to(FakeTaskService);
  });

  describe('Create a Task', () => {
    it('Create', async () => {
      const createTaskDto: CreateTaskDto = {
        name: 'New Task',
        displayOrder: 1,
        description: 'new task',
      };

      const response = await agent
        .post(baseURL)
        .send(createTaskDto)
        .expect(200);

      // Check the response for the created task data
      const createdTask = response.body;
      expect(createdTask.name).toBe('New Task');
      expect(createdTask.displayOrder).toBe(1);
    });
  });

  describe('Update', () => {
    it('Update a Task', async () => {
      const attrs: Partial<Task> = {
        name: 'Updated Task Name',
      };

      const response = await agent
        .put(`${baseURL}/${taskId}`)
        .send(attrs)
        .expect(200);

      // Check the response for the updated task data
      const updatedTask = response.body;
      expect(updatedTask.name).toBe('Updated Task Name');
    });
  });

  describe('Delete', () => {
    it('Delete a Task', async () => {
      await agent.delete(`${baseURL}/${taskId}`).expect(204);
    });
  });
});
