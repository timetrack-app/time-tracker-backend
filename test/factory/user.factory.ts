import { faker } from '@faker-js/faker';
import { User } from '../../src/modules/user/entity/user.entity';

function generateUserData(obj: Partial<User> = {}): User {
  return {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    isVerified: true,
    workSessions: [],
    templates: [],
    ...obj,
  } as unknown as User;
}

function generateUsersData(n = 1, object: Partial<User> = {}) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return generateUserData({ ...object }) as User;
    },
  );
}

export const fakeUsers = (size) => generateUsersData(size);

export const fakeUser = (): User => {
  const fakeUsers = generateUsersData(1);
  return fakeUsers[0];
};
