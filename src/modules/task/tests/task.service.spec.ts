import 'reflect-metadata';
import { TaskService } from '../service/task.service';
import { ITaskRepository } from '../interface/ITask.repository';
import { Task } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/createTask.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { ITaskService } from '../interface/ITask.service';
import { IWorkSessionRepository } from '../../workSession/interfaces/IWorkSession.repository';
import { fakeTask } from '../../../../test/factory/task.factory';
import { ITabRepository } from '../../../modules/tab/interface/ITab.repository';
import { fakeTab } from '../../../../test/factory/tab.factory';
import { fakeList } from '../../../../test/factory/list.factory';
import { IListRepository } from '../../../modules/list/interface/IList.repository';

describe('Task Service Test', () => {
  let taskService: ITaskService;

  // Dummy data implementation
  const fakeTaskA = fakeTask();

  const fakeTabA = fakeTab();

  const fakeListA = fakeList();

  const validId = 1;
  const invalidId = 0;

  // Mock repositories and logger
  const mockTaskRepository: ITaskRepository = {
    create: jest.fn((workSession: any, createTaskDto: CreateTaskDto) =>
      Promise.resolve(fakeTaskA),
    ),
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === validId ? fakeTaskA : null),
    ),
    update: jest.fn((task: Task) => Promise.resolve(fakeTaskA)),
    delete: jest.fn((id: number) => Promise.resolve()),
  };

  const mockWorkSessionRepository: IWorkSessionRepository = {
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === validId ? { id: 1 } : null),
    ),
  } as unknown as IWorkSessionRepository;

  const mockTabRepository: ITabRepository = {
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === validId ? fakeTabA : null),
    ),
  } as unknown as ITabRepository;

  const mockListRepository: IListRepository = {
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === validId ? fakeListA : null),
    ),
  } as unknown as IListRepository;

  const mockLogger: Logger = {
    error: jest.fn(),
  } as unknown as Logger;

  // Test starts from here
  beforeEach(() => {
    taskService = new TaskService(
      mockTaskRepository,
      mockWorkSessionRepository,
      mockTabRepository,
      mockListRepository,
      mockLogger,
    );
  });

  describe('Create Task', () => {
    const createTaskDto: CreateTaskDto = {
      name: 'Task C',
      displayOrder: 3,
      description: 'Task C',
    };
    it('Should create a task', async () => {
      const response = await taskService.createTask(
        validId,
        validId,
        validId,
        createTaskDto,
      );
      expect(response).toEqual(fakeTaskA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        taskService.createTask(invalidId, validId, validId, createTaskDto),
      ).rejects.toThrow(
        new NotFoundException('WorkSession with Id 0 not found'),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        taskService.createTask(validId, invalidId, validId, createTaskDto),
      ).rejects.toThrow(new NotFoundException('Tab with Id 0 not found'));
    });

    it('Should throw NotFoundException when list is not found', async () => {
      await expect(
        taskService.createTask(validId, validId, invalidId, createTaskDto),
      ).rejects.toThrow(new NotFoundException('List with Id 0 not found'));
    });

    it('Should throw InternalServerErrorException when task creation fails', async () => {
      mockTaskRepository.create = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        taskService.createTask(validId, validId, validId, {} as CreateTaskDto),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create a task.'),
      );
    });
  });

  describe('Update Task', () => {
    it('Should update a task', async () => {
      const attrs = { name: 'Updated Task A' };
      const response = await taskService.updateTask(
        validId,
        validId,
        validId,
        validId,
        attrs,
      );
      expect(response).toEqual(fakeTaskA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        taskService.updateTask(invalidId, validId, validId, validId, {}),
      ).rejects.toThrow(
        new NotFoundException(`WorkSession with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        taskService.updateTask(validId, invalidId, validId, validId, {}),
      ).rejects.toThrow(
        new NotFoundException(`Tab with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when list is not found', async () => {
      await expect(
        taskService.updateTask(validId, validId, invalidId, validId, {}),
      ).rejects.toThrow(
        new NotFoundException(`List with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when task is not found', async () => {
      await expect(
        taskService.updateTask(validId, validId, validId, invalidId, {}),
      ).rejects.toThrow(
        new NotFoundException(`Task with Id ${invalidId} not found`),
      );
    });

    it('Should throw InternalServerErrorException when task update fails', async () => {
      mockTaskRepository.update = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        taskService.updateTask(validId, validId, validId, validId, {}),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to update a task.'),
      );
    });
  });

  describe('Delete Task', () => {
    it('Should delete a task', async () => {
      await taskService.deleteTask(validId, validId, validId, validId);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith(validId);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        taskService.deleteTask(invalidId, validId, validId, validId),
      ).rejects.toThrow(
        new NotFoundException(`WorkSession with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        taskService.deleteTask(validId, invalidId, validId, validId),
      ).rejects.toThrow(
        new NotFoundException(`Tab with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when list is not found', async () => {
      await expect(
        taskService.deleteTask(validId, validId, invalidId, validId),
      ).rejects.toThrow(
        new NotFoundException(`List with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when task is not found', async () => {
      await expect(
        taskService.deleteTask(validId, validId, validId, invalidId),
      ).rejects.toThrow(
        new NotFoundException(`Task with Id ${invalidId} not found`),
      );
    });

    it('Should throw InternalServerErrorException when task deletion fails', async () => {
      mockTaskRepository.delete = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        taskService.deleteTask(validId, validId, validId, validId),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to delete a task.'),
      );
    });
  });
});
