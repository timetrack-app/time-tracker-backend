import { faker } from '@faker-js/faker';
import { Tab } from '../../src/modules/tab/entity/tab.entity';

function generateTabData(obj: Partial<Tab> = {}): Tab {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    displayOrder: faker.datatype.number(),
  } as unknown as Tab;
}

function generateTabsData(n = 1, object: Partial<Tab> = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateTabData({ ...object }) as Tab;
    },
  );
}

export const fakeTabs = (size) => generateTabsData(size);

export const fakeTab = (): Tab => {
  const fakeTabs = generateTabsData(1);
  return fakeTabs[0];
};
