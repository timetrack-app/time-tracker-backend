import { faker } from '@faker-js/faker';
import { Task } from '../../src/modules/task/entity/task.entity';

function generateTaskData(obj: Partial<Task> = {}): Task {
  return {
    id: faker.datatype.number(),
    name: faker.datatype.string(),
    displayOrder: faker.datatype.number(),
    description: faker.datatype.string(),
  } as unknown as Task;
}

function generateTasksData(n = 1, object: Partial<Task> = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateTaskData({ ...object }) as Task;
    },
  );
}

export const fakeTasks = (size) => generateTasksData(size);

export const fakeTask = (): Task => {
  const fakeTasks = generateTasksData(1);
  return fakeTasks[0];
};
