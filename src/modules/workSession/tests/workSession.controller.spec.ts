import { agent } from '../../../../test/utils/supertest.utils';
import { fakeWorkSession } from '../../../../test/factory/workSession.factory';
import container from '../../../core/container.core';
import { IWorkSessionService } from '../interfaces/IWorkSession.service';
import { TYPES } from '../../../core/type.core';
import { FakeWorkSessionService } from '../../../../test/service/fakeWorkSession.service';
import { fakeTask } from '../../../../test/factory/task.factory';

describe('WorkSession Controller Test', () => {
  beforeAll(() => {
    container
      .rebind<IWorkSessionService>(TYPES.IWorkSessionService)
      .to(FakeWorkSessionService);
  });

  describe('Find Latest Unfinished Work Session', () => {
    it('should get the latest unfinished work session', (done: jest.DoneCallback) => {
      const userId = 1; // Replace with the user ID for testing
      agent.get(`/users/${userId}/work-sessions/latest`).expect(200, done);
    });
  });

  describe('Create Work Session', () => {
    it('should create a new work session', (done: jest.DoneCallback) => {
      const userId = 1;
      const workSession = fakeWorkSession();
      agent
        .post(`/users/${userId}/work-sessions`)
        .send({
          tabs: workSession.tabs,
        })
        .expect(200, done);
    });
  });

  describe('End Work Session', () => {
    it('should end a work session', (done: jest.DoneCallback) => {
      const userId = 1;
      const workSessionId = 1;
      agent
        .put(`/users/${userId}/work-sessions/${workSessionId}/end`)
        .expect(200, done);
    });
  });
});
