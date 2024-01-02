import 'reflect-metadata';
import { WorkSessionRepository } from '../repository/workSession.repository';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { WorkSession } from '../entity/workSession.entity';
import { CreateWorkSessionDto } from '../dto/create-work-session.dto';
import { FindLatestUnfinishedWorkSessionDto } from '../dto/find-latest-unfinished-work-session-dto';
import { fakeWorkSession } from '../../../../test/factory/workSession.factory';
import { fakeUser } from '../../../../test/factory/user.factory';
import { fakeTabs } from '../../../../test/factory/tab.factory';

describe('WorkSession Repository Test', () => {
  let workSessionRepository: WorkSessionRepository;

  // Mock database service
  const mockDatabaseService: IDatabaseService = {
    getRepository: jest.fn(),
    getManager: jest.fn(),
  };

  // Mock WorkSession entity instance
  const fakeWorkSessionA: WorkSession = fakeWorkSession();

  // Mock CreateWorkSessionDto instance
  const createWorkSessionDto: CreateWorkSessionDto = {
    user: fakeUser(),
    tabs: fakeTabs(10),
  };

  // Mock FindLatestUnfinishedWorkSessionDto instance
  const findLatestUnfinishedWorkSessionDto: FindLatestUnfinishedWorkSessionDto =
    {
      userId: 1,
      // Add other properties as needed
    };

  // Mock QueryBuilder and QueryRunner
  const mockQueryBuilder = {
    where: jest.fn(() => mockQueryBuilder),
    andWhere: jest.fn(() => mockQueryBuilder),
    getOne: jest.fn(() => fakeWorkSession),
    execute: jest.fn(),
    update: jest.fn(() => mockQueryBuilder),
    set: jest.fn(() => mockQueryBuilder),
    returning: jest.fn(() => mockQueryBuilder),
    updateEntity: jest.fn(() => mockQueryBuilder),
    findOneBy: jest.fn().mockResolvedValue(fakeWorkSession),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    innerJoinAndSelect: jest.fn(() => mockQueryBuilder),
    leftJoinAndSelect: jest.fn(() => mockQueryBuilder),
  };

  const mockEntityManager = {
    save: jest.fn().mockResolvedValue(fakeWorkSession),
    connection: {
      createQueryRunner: jest.fn(() => mockQueryRunner),
    },
  };

  const mockQueryRunner = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: mockEntityManager,
  };

  // Test starts from here
  beforeEach(() => {
    workSessionRepository = new WorkSessionRepository(mockDatabaseService);

    // Mock the getWorkSessionRepo method
    workSessionRepository['getWorkSessionRepo'] = jest
      .fn()
      .mockResolvedValue(mockQueryBuilder);

    // Mock the create method on the repository
    mockDatabaseService.getRepository = jest.fn().mockResolvedValue({
      create: jest.fn(() => fakeWorkSession),
      createQueryBuilder: () => mockQueryBuilder,
    });

    mockDatabaseService.getManager = jest.fn().mockResolvedValue(mockEntityManager);
  });

  describe('findOneById', () => {
    it('Should find a WorkSession by ID', async () => {
      const response = await workSessionRepository.findOneById(1);
      expect(response).toEqual(fakeWorkSession);
    });
  });

  describe('findLatestUnfinished', () => {
    it('Should find the latest unfinished WorkSession', async () => {
      const response = await workSessionRepository.findLatestUnfinished(
        findLatestUnfinishedWorkSessionDto,
      );
      expect(response).toEqual(fakeWorkSession);
    });
  });

  describe('create', () => {
    it('Should create a new WorkSession', async () => {
      // Mock transaction methods
      // const startTransaction = jest.fn();
      // const commitTransaction = jest.fn();
      // const rollbackTransaction = jest.fn();
      // const release = jest.fn();

      // // Mock the query runner
      // const queryRunner = {
      //   startTransaction,
      //   commitTransaction,
      //   rollbackTransaction,
      //   release,
      //   manager: {
      //     save: jest.fn(),
      //   },
      // };

      // // Mock the getManager method
      // mockDatabaseService.getManager = jest.fn().mockResolvedValue(queryRunner);

      // const response = await workSessionRepository.create(createWorkSessionDto);

      // expect(response).toEqual(fakeWorkSession);

      const response = await workSessionRepository.create(createWorkSessionDto);

      expect(response).toEqual(fakeWorkSession);
      expect(mockEntityManager.save).toHaveBeenCalledWith(expect.any(WorkSession));
    });
  });

  describe('update', () => {
    it('Should update a WorkSession', async () => {
      const response = await workSessionRepository.update(1);
      expect(response).toEqual(fakeWorkSession);
    });
  });
});
