import { faker } from '@faker-js/faker';
import { WorkSession } from '../../src/modules/workSession/entity/workSession.entity';
import { fakeTabs } from './tab.factory';

function generateWorkSessionData(obj: Partial<WorkSession> = {}): WorkSession {
  return {
    id: faker.datatype.number(),
    userId: faker.datatype.number(),
    tabs: fakeTabs(10),
  } as unknown as WorkSession;
}

function generateWorkSessionsData(n = 1, object: Partial<WorkSession> = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateWorkSessionData({ ...object }) as WorkSession;
    },
  );
}

export const fakeWorkSessions = (size) => generateWorkSessionsData(size);

export const fakeWorkSession = (): WorkSession => {
  const fakeWorkSessions = generateWorkSessionsData(1);
  return fakeWorkSessions[0];
};
