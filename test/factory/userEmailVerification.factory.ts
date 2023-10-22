import { faker } from '@faker-js/faker';
import { UserEmailVerification } from '../../src/modules/userEmailVerification/entity/userEmailVerification.entity';

export const fakeToken = 'abc123def'

export function generateVerificationData(obj: Partial<UserEmailVerification>): UserEmailVerification {
  return {
    id: faker.datatype.number(),
    email: faker.internet.email(),
    verificationToken: obj.verificationToken || fakeToken,
    ...obj
  } as unknown as UserEmailVerification
};

export const fakeUserEmailVerificationData = generateVerificationData({});
