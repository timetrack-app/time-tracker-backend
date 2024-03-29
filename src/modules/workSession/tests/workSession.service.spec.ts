import 'reflect-metadata';
import { WorkSessionService } from '../service/workSession.service';
import { IWorkSessionRepository } from '../interfaces/IWorkSession.repository';
import { CreateWorkSessionServiceDto } from '../dto/create-work-session-service-dto';
import { EndWorkSessionDto } from '../dto/end-work-session-dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { IUserRepository } from '../../../modules/user/interfaces/IUser.repository';
import { fakeWorkSession } from '../../../../test/factory/workSession.factory';
import { fakeTask } from '../../../../test/factory/task.factory';
import { ITabRepository } from 'src/modules/tab/interface/ITab.repository';
import { ITaskRepository } from 'src/modules/task/interface/ITask.repository';
import { IListRepository } from 'src/modules/list/interface/IList.repository';
import { getWorkSessionsByUserIdDto } from '../dto/getWorkSessionByUserId.dto';

describe('WorkSession Service Test', () => {
  let workSessionService: WorkSessionService;

  // Dummy data implementation
  const fakeWorkSessionA = fakeWorkSession();

  // Mock repositories and logger
  const mockWorkSessionRepository: IWorkSessionRepository = {
    create: jest.fn(() => Promise.resolve(fakeWorkSessionA)),
    update: jest.fn(() => Promise.resolve(fakeWorkSessionA)),
    findLatestUnfinished: jest.fn(() => Promise.resolve(fakeWorkSessionA)),
  } as unknown as IWorkSessionRepository;

  const mockUserRepository: IUserRepository = {
    findOneById: jest.fn(() => Promise.resolve({ id: 1 })),
  } as unknown as IUserRepository;

  const mockTabRepository: ITabRepository = {
    findOneById: jest.fn(() => Promise.resolve({ id: 1 })),
  } as unknown as ITabRepository;

  const mockListRepository: IListRepository = {
    findOneById: jest.fn(() => Promise.resolve({ id: 1 })),
  } as unknown as IListRepository;

  const mockTaskRepository: ITaskRepository = {
    findOneById: jest.fn(() => Promise.resolve({ id: 1 })),
  } as unknown as ITaskRepository;

  const mockLogger: Logger = {
    error: jest.fn(),
  } as unknown as Logger;

  // Test starts from here
  beforeEach(() => {
    workSessionService = new WorkSessionService(
      mockUserRepository,
      mockWorkSessionRepository,
      mockTabRepository,
      mockListRepository,
      mockTaskRepository,
      mockLogger,
    );
  });

  describe('Get Work Sessions By User ID', () => {
    it('Should get all work sessions for a user', async () => {
      const getWorkSessionsByUserIdDto: getWorkSessionsByUserIdDto = {
        userId: 1,
      };
      const response = await workSessionService.getWorkSessionsByUserId(
        getWorkSessionsByUserIdDto,
      );
      expect(response).toEqual([fakeWorkSessionA]);
    });
  });

  describe('Create WorkSession', () => {
    const createWorkSessionServiceDto: CreateWorkSessionServiceDto = {
      userId: 1,
      tabs: [],
    };

    it('Should create a work session', async () => {
      const response = await workSessionService.createWorkSession(
        createWorkSessionServiceDto,
      );
      expect(response.workSession).toEqual(fakeWorkSessionA);
    });

    it('Should return an unfinished work session', async () => {
      // Mock that there is an unfinished work session
      mockWorkSessionRepository.findLatestUnfinished = jest.fn(() =>
        Promise.resolve(fakeWorkSessionA),
      );

      const response = await workSessionService.createWorkSession(
        createWorkSessionServiceDto,
      );
      expect(response.isUnfinished).toBeTruthy();
      expect(response.workSession).toEqual(fakeWorkSessionA);
    });
  });

  describe('Update Active Task', () => {});

  describe('Get Latest Unfinished WorkSession', () => {
    it('Should get the latest unfinished work session', async () => {
      const findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto =
        {
          userId: 1,
        };
      const response = await workSessionService.getLatestUnfinishedWorkSession(
        findLatestUnfinishedWorkSessionDto,
      );
      expect(response).toEqual(fakeWorkSessionA);
    });

    it('Should throw NotFoundException when no unfinished work session is found', async () => {
      // Mock that no unfinished work session is found
      mockWorkSessionRepository.findLatestUnfinished = jest.fn(() =>
        Promise.resolve(null),
      );

      const findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto =
        {
          userId: 1,
        };

      await expect(
        workSessionService.getLatestUnfinishedWorkSession(
          findLatestUnfinishedWorkSessionDto,
        ),
      ).rejects.toThrow(
        new NotFoundException(
          'Failed to get the latest unfinished WorkSession.',
        ),
      );
    });
  });

  describe('End WorkSession', () => {
    it('Should end a work session', async () => {
      const endWorkSessionDto: EndWorkSessionDto = {
        workSessionId: 1,
      };
      const response = await workSessionService.endWorkSession(
        endWorkSessionDto,
      );
      expect(response).toEqual(fakeWorkSessionA);
    });

    it('Should throw InternalServerErrorException when ending work session fails', async () => {
      mockWorkSessionRepository.update = jest.fn(() => {
        throw new Error('Test Error');
      });

      const endWorkSessionDto: EndWorkSessionDto = {
        workSessionId: 1,
      };

      await expect(
        workSessionService.endWorkSession(endWorkSessionDto),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to update a work session.'),
      );
    });
  });
});
