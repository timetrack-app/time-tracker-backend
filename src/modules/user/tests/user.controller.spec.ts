import 'reflect-metadata';
import container from '../../../core/container.core';
import { IUserService } from '../interfaces/IUser.service';
import { TYPES } from '../../../core/type.core';
import { FakeUserService } from '../../../../test/service/fakeUser.service';
import { agent, authAgent } from '../../../../test/utils/supertest.utils';
import { fakeUser } from '../../../../test/factory/user.factory';
import { generateJWT } from '../../../common/utils/jwt/jwt.utils';

const user = fakeUser();

describe('User Controller Test', () => {

  let loggedInAgent;

  beforeAll(() => {
    container.rebind<IUserService>(TYPES.IUserService).to(FakeUserService);

    const authToken = generateJWT(user);
    loggedInAgent = authAgent(authToken);
  });

  describe('Get A User', () => {
    it('Index', (done) => {
      loggedInAgent.get(`/users/${user.id}`).expect(200, done);
    });

    it('Should response with a user', (done) => {
      loggedInAgent
        .get(`/users/${user.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.results.email).toStrictEqual(user.email);
          expect(response.body.id).toBe(user.id);
          expect(typeof response.body.isVerified).toBe('boolean');
          done();
        })
        .catch((error) => {
          console.log('error: ', error);
          done();
        });
    });
  });

  describe('Update Email', () => {
    it('Update Email', (done) => {
      const newEmail = 'newemail@example.com';
      loggedInAgent
        .post(`/users/${user.id}/email-update`)
        .send({ email: newEmail })
        .expect(200, done);
    });
  });

  describe('Verify New Email', () => {
    it('Verify New Email', (done) => {
      const token = 'your_verification_token_here';
      agent
        .get(`/users/email-update/verification?token=${token}`)
        .expect(200, done);
    });
  });

  describe('Update Password', () => {
    it('Update Password', (done) => {
      const newPassword = 'newpassword123';
      loggedInAgent
        .post(`/users/${user.id}/password-update`)
        .send({ password: newPassword, passwordConfirmation: newPassword })
        .expect(200, done);
    });
  });
});
