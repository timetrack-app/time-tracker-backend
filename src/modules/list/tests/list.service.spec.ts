import 'reflect-metadata';
import { ListService } from '../service/list.service';
import { IListRepository } from '../interface/IList.repository';
import { List } from '../entity/list.entity';
import { CreateListDto } from '../dto/createList.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { IListService } from '../interface/IList.service';
import { IWorkSessionRepository } from '../../../modules/workSession/interfaces/IWorkSession.repository';
import { fakeList } from '../../../../test/factory/list.factory';
import { ITabRepository } from 'src/modules/tab/interface/ITab.repository';
import { fakeTab } from '../../../../test/factory/tab.factory';

describe('List Service Test', () => {
  let listService: IListService;

  // Dummy data implementation
  const fakeListA = fakeList();

  const fakeTabA = fakeTab();

  const validId = 1;
  const invalidId = 0;

  // Mock repositories and logger
  const mockListRepository: IListRepository = {
    create: jest.fn((workSession: any, createListDto: CreateListDto) =>
      Promise.resolve(fakeListA),
    ),
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === validId ? fakeListA : null),
    ),
    update: jest.fn((list: List) => Promise.resolve(fakeListA)),
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

  const mockLogger: Logger = {
    error: jest.fn(),
  } as unknown as Logger;

  // Test starts from here
  beforeEach(() => {
    listService = new ListService(
      mockListRepository,
      mockWorkSessionRepository,
      mockTabRepository,
      mockLogger,
    );
  });

  describe('Create List', () => {
    const createListDto: CreateListDto = {
      name: 'List C',
      displayOrder: 3,
    };
    it('Should create a list', async () => {
      const response = await listService.createList(
        validId,
        validId,
        createListDto,
      );
      expect(response).toEqual(fakeListA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        listService.createList(invalidId, validId, createListDto),
      ).rejects.toThrow(
        new NotFoundException('WorkSession with Id 0 not found'),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        listService.createList(validId, invalidId, createListDto),
      ).rejects.toThrow(new NotFoundException('Tab with Id 0 not found'));
    });

    it('Should throw InternalServerErrorException when list creation fails', async () => {
      mockListRepository.create = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        listService.createList(validId, validId, {} as CreateListDto),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to create a list.'),
      );
    });
  });

  describe('Update List', () => {
    it('Should update a list', async () => {
      const attrs = { name: 'Updated List A' };
      const response = await listService.updateList(
        validId,
        validId,
        validId,
        attrs,
      );
      expect(response).toEqual(fakeListA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        listService.updateList(invalidId, validId, validId, {}),
      ).rejects.toThrow(
        new NotFoundException(`WorkSession with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        listService.updateList(validId, invalidId, validId, {}),
      ).rejects.toThrow(
        new NotFoundException(`Tab with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when list is not found', async () => {
      await expect(
        listService.updateList(validId, validId, invalidId, {}),
      ).rejects.toThrow(
        new NotFoundException(`List with Id ${invalidId} not found`),
      );
    });

    it('Should throw InternalServerErrorException when list update fails', async () => {
      mockListRepository.update = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        listService.updateList(validId, validId, validId, {}),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to update a list.'),
      );
    });
  });

  describe('Delete List', () => {
    it('Should delete a list', async () => {
      await listService.deleteList(validId, validId, validId);
      expect(mockListRepository.delete).toHaveBeenCalledWith(validId);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(
        listService.deleteList(invalidId, validId, validId),
      ).rejects.toThrow(
        new NotFoundException(`WorkSession with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(
        listService.deleteList(validId, invalidId, validId),
      ).rejects.toThrow(
        new NotFoundException(`Tab with Id ${invalidId} not found`),
      );
    });

    it('Should throw NotFoundException when list is not found', async () => {
      await expect(
        listService.deleteList(validId, validId, invalidId),
      ).rejects.toThrow(
        new NotFoundException(`List with Id ${invalidId} not found`),
      );
    });

    it('Should throw InternalServerErrorException when list deletion fails', async () => {
      mockListRepository.delete = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(
        listService.deleteList(validId, validId, validId),
      ).rejects.toThrow(
        new InternalServerErrorException('Failed to delete a list.'),
      );
    });
  });
});
