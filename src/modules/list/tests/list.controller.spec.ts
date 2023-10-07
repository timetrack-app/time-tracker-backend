import 'reflect-metadata';
import container from '../../../core/container.core';
import { TYPES } from '../../../core/type.core';
import { agent } from '../../../../test/utils/supertest.utils';
import { CreateListDto } from '../dto/createList.dto';
import { IListService } from '../interface/IList.service';
import { FakeListService } from '../../../../test/service/fakeList.service';
import { List } from '../entity/list.entity';

const workSessionId = 1;
const tabId = 1;
const listId = 1;
const baseURL = `/work-sessions/${workSessionId}/tabs/${tabId}/lists`;

describe('List Controller Test', () => {
  beforeAll(() => {
    container.rebind<IListService>(TYPES.IListService).to(FakeListService);
  });

  describe('Create a List', () => {
    it('Create', async () => {
      const createListDto: CreateListDto = {
        name: 'New List',
        displayOrder: 1,
      };

      const response = await agent
        .post(baseURL)
        .send(createListDto)
        .expect(200);

      // Check the response for the created list data
      const createdList = response.body;
      expect(createdList.name).toBe('New List');
      expect(createdList.displayOrder).toBe(1);
    });
  });

  describe('Update', () => {
    it('Update a List', async () => {
      const attrs: Partial<List> = {
        name: 'Updated List Name',
      };

      const response = await agent
        .put(`${baseURL}/${listId}`)
        .send(attrs)
        .expect(200);

      // Check the response for the updated list data
      const updatedList = response.body;
      expect(updatedList.name).toBe('Updated List Name');
    });
  });

  describe('Delete', () => {
    it('Delete a List', async () => {
      await agent.delete(`${baseURL}/${listId}`).expect(204);
    });
  });
});
