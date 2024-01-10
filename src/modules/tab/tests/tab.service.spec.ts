import 'reflect-metadata';
import { TabService } from '../service/tab.service';
import { ITabRepository } from '../interface/ITab.repository';
import { Tab } from '../entity/tab.entity';
import { CreateTabDto } from '../dto/CreateTab.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '../../../common/errors/all.exception';
import { Logger } from '../../../common/services/logger.service';
import { ITabService } from '../interface/ITab.service';
import { IWorkSessionRepository } from '../../../modules/workSession/interfaces/IWorkSession.repository';
import { fakeTab } from '../../../../test/factory/tab.factory';

describe('Tab Service Test', () => {
  let tabService: ITabService;

  // Dummy data implementation
  const fakeTabA = fakeTab();

  // Mock repositories and logger
  const mockTabRepository: ITabRepository = {
    create: jest.fn((workSession: any, createTabDto: CreateTabDto) =>
      Promise.resolve(fakeTabA),
    ),
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === 1 ? fakeTabA : null),
    ),
    update: jest.fn((tab: Tab) => Promise.resolve(fakeTabA)),
    delete: jest.fn((id: number, workSession: any) => Promise.resolve()),
  };

  const mockWorkSessionRepository: IWorkSessionRepository = {
    findOneById: jest.fn((id: number) =>
      Promise.resolve(id === 1 ? { id: 1 } : null),
    ),
  } as unknown as IWorkSessionRepository;

  const mockLogger: Logger = {
    error: jest.fn(),
  } as unknown as Logger;

  // Test starts from here
  beforeEach(() => {
    tabService = new TabService(
      mockTabRepository,
      mockWorkSessionRepository,
      mockLogger,
    );
  });

  describe('Create Tab', () => {
    const createTabDto: CreateTabDto = {
      name: 'Tab C',
      displayOrder: 3,
    };
    it('Should create a tab', async () => {
      const response = await tabService.createTab(1, createTabDto);
      expect(response).toEqual(fakeTabA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(tabService.createTab(0, createTabDto)).rejects.toThrow(
        new NotFoundException('workSession with Id 0 was not found'),
      );
    });

    it('Should throw InternalServerErrorException when tab creation fails', async () => {
      mockTabRepository.create = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(tabService.createTab(1, {} as CreateTabDto)).rejects.toThrow(
        new InternalServerErrorException('Failed to create a tab.'),
      );
    });
  });

  describe('Update Tab', () => {
    it('Should update a tab', async () => {
      const attrs = { name: 'Updated Tab A' };
      const response = await tabService.updateTab(1, 1, attrs);
      expect(response).toEqual(fakeTabA);
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(tabService.updateTab(0, 1, {})).rejects.toThrow(
        new NotFoundException('WorkSession with ID 0 not found'),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(tabService.updateTab(1, 0, {})).rejects.toThrow(
        new NotFoundException('Tab with ID 0 not found'),
      );
    });

    it('Should throw InternalServerErrorException when tab update fails', async () => {
      mockTabRepository.update = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(tabService.updateTab(1, 1, {})).rejects.toThrow(
        new InternalServerErrorException('Failed to update a tab.'),
      );
    });
  });

  describe('Delete Tab', () => {
    it('Should delete a tab', async () => {
      await tabService.deleteTab(1, 1);
      expect(mockTabRepository.delete).toHaveBeenCalledWith(1, { id: 1 });
    });

    it('Should throw NotFoundException when work session is not found', async () => {
      await expect(tabService.deleteTab(0, 1)).rejects.toThrow(
        new NotFoundException('workSession with Id 0 was not found'),
      );
    });

    it('Should throw NotFoundException when tab is not found', async () => {
      await expect(tabService.deleteTab(1, 0)).rejects.toThrow(
        new NotFoundException('Tab with ID 0 not found'),
      );
    });

    it('Should throw InternalServerErrorException when tab deletion fails', async () => {
      mockTabRepository.delete = jest.fn(() => {
        throw new Error('Test Error');
      });
      await expect(tabService.deleteTab(1, 1)).rejects.toThrow(
        new InternalServerErrorException('Failed to delete a tab.'),
      );
    });
  });
});
