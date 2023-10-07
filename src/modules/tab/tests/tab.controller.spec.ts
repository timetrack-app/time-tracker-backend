import 'reflect-metadata';
import container from '../../../core/container.core';
import { TYPES } from '../../../core/type.core';
import { agent } from '../../../../test/utils/supertest.utils';
import { CreateTabDto } from '../dto/CreateTab.dto';
import { ITabService } from '../interface/ITab.service';
import { FakeTabService } from '../../../../test/service/fakeTab.service';
import { Tab } from '../entity/tab.entity';

const workSessionId = 1;
const tabId = 1;
const baseURL = `/work-sessions/${workSessionId}/tabs`;

describe('Tab Controller Test', () => {
  beforeAll(() => {
    container.rebind<ITabService>(TYPES.ITabService).to(FakeTabService);
  });

  describe('Create a Tab', () => {
    it('Create', async () => {
      const createTabDto: CreateTabDto = {
        name: 'New Tab',
        displayOrder: 1,
      };

      const response = await agent.post(baseURL).send(createTabDto).expect(200);

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

      const response = await agent
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
      await agent.delete(`/work-sessions/1/tabs/${tabId}`).expect(204);
    });
  });
});
