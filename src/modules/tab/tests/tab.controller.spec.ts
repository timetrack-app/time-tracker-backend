import 'reflect-metadata';
import container from '../../../core/container.core';
import { TYPES } from '../../../core/type.core';
import { authAgent } from '../../../../test/utils/supertest.utils';
import { CreateTabDto } from '../dto/CreateTab.dto';
import { ITabService } from '../interface/ITab.service';
import { FakeTabService } from '../../../../test/service/fakeTab.service';
import { Tab } from '../entity/tab.entity';
import { generateJWT } from '../../../common/utils/jwt/jwt.utils';
import { fakeUser } from '../../../../test/factory/user.factory';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { WorkSessionRepository } from '../../../modules/workSession/repository/workSession.repository';
import { IWorkSessionRepository } from '../../../modules/workSession/interfaces/IWorkSession.repository';
import { fakeWorkSession } from '../../../../test/factory/workSession.factory';

const workSessionId = 1;
const tabId = 1;
const baseURL = `/work-sessions/${workSessionId}/tabs`;

const user = fakeUser();

describe('Tab Controller Test', () => {
  const mockDatabaseService: IDatabaseService = {
    getRepository: jest.fn(),
    getManager: jest.fn(),
  };
  
  const mockQueryBuilder = {
    findOneBy: jest.fn().mockResolvedValue(fakeWorkSession),
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
  
  mockDatabaseService.getRepository = jest.fn().mockResolvedValue({
    create: jest.fn(() => fakeWorkSession),
    createQueryBuilder: () => mockQueryBuilder,
  });
  
  mockDatabaseService.getManager = jest.fn().mockResolvedValue(mockEntityManager);

  let loggedInAgent;

  beforeAll(() => {
    container.rebind<ITabService>(TYPES.ITabService).to(FakeTabService);

    const authToken = generateJWT(user);
    loggedInAgent = authAgent(authToken);
  });

  let workSessionRepository: IWorkSessionRepository;
  beforeEach(() => {
    workSessionRepository = new WorkSessionRepository(mockDatabaseService);

    workSessionRepository['getWorkSessionRepo'] = jest
    .fn()
    .mockResolvedValue(mockQueryBuilder);
  });

  describe('Create a Tab', () => {
    it('Create', async () => {
      const createTabDto: CreateTabDto = {
        name: 'New Tab',
        displayOrder: 1,
      };
      const r = await loggedInAgent.post(baseURL).send(createTabDto);
      console.log(r);
      const response = await loggedInAgent.post(baseURL).send(createTabDto).expect(200);

      // Check the response for the created tab data
      const createdTab = response.body;
      expect(createdTab.name).toBe('New Tab');
      expect(createdTab.displayOrder).toBe(1);
    });
  });

  describe('Update', () => {
    it('Update a Tab', async () => {
      const attrs: Partial<Tab> = {
        name: 'Updated Tab Name',
      };

      const response = await loggedInAgent
        .put(`${baseURL}/${tabId}`)
        .send(attrs)
        .expect(200);

      // Check the response for the updated tab data
      const updatedTab = response.body;
      expect(updatedTab.name).toBe('Updated Tab Name');
    });
  });

  describe('Delete', () => {
    it('Delete a Tab', async () => {
      await loggedInAgent.delete(`${baseURL}/${tabId}`).expect(204);
    });
  });
});
