import { faker } from '@faker-js/faker';
import { List } from '../../src/modules/list/entity/list.entity';

function generateListData(obj: Partial<List> = {}): List {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    displayOrder: faker.datatype.number(),
  } as unknown as List;
}

function generateListsData(n = 1, object: Partial<List> = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateListData({ ...object }) as List;
    },
  );
}

export const fakeLists = (size) => generateListsData(size);

export const fakeList = (): List => {
  const fakeLists = generateListsData(1);
  return fakeLists[0];
};
